import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="374177571286-24094g14i31p1ljpm95hb8dsmdl8qj23.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>

  // </StrictMode>
);
