import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// TermsAndConditionsPage.jsx
export default function TermsAndConditionsPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4">
        These Terms and Conditions ("Terms") govern your access and use of Match
        Trackers (“we”, “our”, “us”) website, services, and content. By
        accessing or using our platform, you agree to be bound by these Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Content</h2>
      <p className="mb-4">
        All content on our platform including scores, articles, images, and
        media is owned by or licensed to us. You may not copy, reproduce, or
        distribute without permission.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. User Responsibilities
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Provide accurate information when creating an account or engaging with
          content.
        </li>
        <li>Not misuse the platform for illegal or unauthorized purposes.</li>
        <li>Respect other users, authors, and contributors.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Live Scores & Data
      </h2>
      <p className="mb-4">
        We strive to provide accurate live data, but we are not liable for any
        inaccuracies or delays in score updates.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        4. Limitation of Liability
      </h2>
      <p className="mb-4">
        Match Trackers is not responsible for any loss or damage resulting from
        use of our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate these Terms or
        use the platform maliciously.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Governing Law</h2>
      <p className="mb-4">
        These Terms are governed by the laws of the jurisdiction in which Match
        Trackers operates.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms from time to time. Continued use of the
        platform means acceptance of the updated Terms.
      </p>

      <p className="mt-8">Last updated: April 16, 2025</p>
    </div>
  );
}
