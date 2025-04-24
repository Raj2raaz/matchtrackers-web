import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Player from "./pages/Player";
import Schedules from "./pages/Schedules";
import ScrollToTop from "./utils/ScrollToTop";
import PointsTable from "./pages/PointsTable";
import Match from "./pages/Match";
import MatchList from "./pages/MatchList";
import CricketScoresDashboard from "./pages/MatchList";
import Rankings from "./pages/Rankings";
import NewsPage from "./pages/News";
import AuthForm from "./pages/Auth";
import ComingSoon from "./pages/ComingSoon";
import Gallery from "./pages/Gallery";
import AllNews from "./pages/AllNews";
import Analytics from "./pages/Analytics";
import AnalyticsRouter from "./components/AnalyticsRouter";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsAndConditionsPage from "./pages/TermsAndConditions";
import FAQPage from "./pages/Faq";
import AboutUsPage from "./pages/About";
import CricketRouter from "./components/CricketRouter";
import FootballRouter from "./components/FootballRouter";

// Layout component to add padding to certain routes
const PaddedLayout = ({ children }) => {
  return <div className="px-2 md:px-24 md:py-8">{children}</div>;
};

export default function App() {
  return (
    <div className="font-inter bg-[#F5F5F5] h-full w-full">
      <Toaster />
      <Router>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route
            path="/Terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />

          <Route
            path="/auth"
            element={
              <PaddedLayout>
                <AuthForm />
              </PaddedLayout>
            }
          />

          <Route path="/" element={<Navigate to="/cricket" replace />} />

          <Route path="/cricket/*" element={<CricketRouter />} />
          <Route path="/football/*" element={<FootballRouter />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
