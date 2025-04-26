const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const { OAuth2Client } = require("google-auth-library");
const { exec } = require("child_process");

const prisma = new PrismaClient();
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "MATCHERS"; // Change this in production

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to create OTP in database
async function createOTP(email, userId) {
  const otp = generateOTP();

  // Set expiration time (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // First, mark any existing OTPs for this user as used
  await prisma.oTP.updateMany({
    where: { userId, isUsed: false },
    data: { isUsed: true },
  });

  // Then create a new OTP
  await prisma.oTP.create({
    data: {
      code: otp,
      email,
      expiresAt,
      userId,
    },
  });

  return otp;
}

// Function to verify OTP
async function verifyOTP(email, code) {
  const now = new Date();

  // Find valid OTP
  const otp = await prisma.oTP.findFirst({
    where: {
      email,
      code,
      isUsed: false,
      expiresAt: { gt: now },
    },
  });

  if (!otp) {
    return null;
  }

  // Mark OTP as used
  await prisma.oTP.update({
    where: { id: otp.id },
    data: { isUsed: true },
  });

  return otp;
}

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">Email Verification</h2>
        <p>Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f2f2f2; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Signup (Create Account)
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with verified status set to false
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    // Generate OTP and send email
    const otp = await createOTP(email, user.id);
    await sendOTPEmail(email, otp);

    res.json({
      message: "Account created. Please check your email for OTP verification.",
      userId: user.id,
      requiresVerification: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating account" });
    console.log(error);
  }
});

// Send OTP for existing user
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Generate OTP and send email
    const otp = await createOTP(email, user.id);
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Error sending OTP" });
    console.log(error);
  }
});

app.post("/api/webhook", (req, res) => {
  console.log("🔔 Received webhook push event from github!", req.body);

  exec("bash /home/ubuntu/app/deploy.sh", (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Deployment error: ${err}`);
      return res.status(500).send("Deployment error");
    }
    console.log(`✅ Deployment output: ${stdout}`);
    console.error(`⚠️ Deployment stderr: ${stderr}`);
    res.status(200).send("Deployment complete");
  });
});

app.get("/api/webhook", (req, res) => {
  return res.send("yes working");
});

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP
    const otpRecord = await verifyOTP(email, otp);

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update user's verification status
    await prisma.user.update({
      where: { id: otpRecord.userId },
      data: { isVerified: true },
    });

    // Get user for token generation
    const user = await prisma.user.findUnique({
      where: { id: otpRecord.userId },
    });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Email verified successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Verification error" });
    console.log(error);
  }
});

// Login (Authenticate User)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password" });

    // Check if user is verified
    if (!user.isVerified) {
      // Generate OTP and send email
      const otp = await createOTP(email, user.id);
      await sendOTPEmail(email, otp);

      return res.status(403).json({
        error: "Email not verified",
        requiresVerification: true,
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login error" });
    console.log(error);
  }
});

app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get user payload from verified token
    const payload = ticket.getPayload();

    // Extract user information
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User exists - handle login

      // Update googleId if it doesn't exist yet
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }

      // Check if user's email is verified
      if (!user.isVerified) {
        // Auto-verify users logging in with Google
        user = await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
      }
    } else {
      // User doesn't exist - handle signup

      // Generate a random password since we won't use it
      // (user will always login via Google)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          password: hashedPassword,
          isVerified: true, // Auto-verify Google users
          profilePicture: picture || null,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // Return success response
    res.json({
      message: "Google authentication successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Get logged-in user (Protected route)
app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    // Get user basic info
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, isVerified: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Get user's favorite matches
    const favoriteMatches = await prisma.favoriteMatch.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Get user's favorite series - commented out for now
    /*
    const favoriteSeries = await prisma.favoriteSeries.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    */

    // Return user info with favorites
    res.json({
      ...user,
      favorites: {
        matches: favoriteMatches,
        // series: favoriteSeries,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to retrieve user information" });
  }
});

app.post("/api/favorites/match", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { matchId, data } = req.body;
    if (!matchId) {
      return res.status(400).json({ error: "Match ID is required" });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteMatch.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Match already in favorites" });
    }

    // Add to favorites
    const favorite = await prisma.favoriteMatch.create({
      data: {
        userId,
        matchId,
        matchData: data,
      },
    });

    res.status(201).json({
      message: "Match added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Error adding match to favorites:", error);
    res.status(500).json({ error: "Failed to add match to favorites" });
  }
});

// Remove match from favorites
app.delete(
  "/api/favorites/match/:matchId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { matchId } = req.params;

      const result = await prisma.favoriteMatch.deleteMany({
        where: {
          userId,
          matchId: Number(matchId),
        },
      });

      if (result.count === 0) {
        return res.status(404).json({ error: "Favorite match not found" });
      }

      res.json({ message: "Match removed from favorites" });
    } catch (error) {
      console.error("Error removing match from favorites:", error);
      res.status(500).json({ error: "Failed to remove match from favorites" });
    }
  }
);

// Add series to favorites
app.post("/api/favorites/series", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { seriesId } = req.body;

    if (!seriesId) {
      return res.status(400).json({ error: "Series ID is required" });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteSeries.findUnique({
      where: {
        userId_seriesId: {
          userId,
          seriesId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Series already in favorites" });
    }

    // Add to favorites
    const favorite = await prisma.favoriteSeries.create({
      data: {
        userId,
        seriesId,
      },
    });

    res.status(201).json({
      message: "Series added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Error adding series to favorites:", error);
    res.status(500).json({ error: "Failed to add series to favorites" });
  }
});

// Remove series from favorites
app.delete(
  "/api/favorites/series/:seriesId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { seriesId } = req.params;

      const result = await prisma.favoriteSeries.deleteMany({
        where: {
          userId,
          seriesId,
        },
      });

      if (result.count === 0) {
        return res.status(404).json({ error: "Favorite series not found" });
      }

      res.json({ message: "Series removed from favorites" });
    } catch (error) {
      console.error("Error removing series from favorites:", error);
      res.status(500).json({ error: "Failed to remove series from favorites" });
    }
  }
);

// Get all favorites for the current user
app.get("/api/favorites", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [matches, series] = await Promise.all([
      prisma.favoriteMatch.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.favoriteSeries.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      matches,
      series,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.get("/api", (req, res) => {
  return res.send("heyyy");
});

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
