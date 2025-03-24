import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <div className="font-red-hat bg-[#F5F5F5] h-full w-full">
      <Toaster />
      <Router>
        <Navbar />
        <ScrollToTop />
        <div className="px-2 md:px-24 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/player/:id" element={<Player />} />
            <Route path="/schedules/:id" element={<Schedules />} />
            <Route path="/points-table/:id" element={<PointsTable />} />
            <Route path="/match/:id" element={<Match />} />
            <Route
              path="/match-list/:type"
              element={<CricketScoresDashboard />}
            />
            <Route path="/rankings/:type" element={<Rankings />} />
            <Route path="/news/:id" element={<NewsPage />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </div>
  );
}
