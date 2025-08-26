import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Football/Landing";
import Match from "../pages/Football/Match";
import Player from "../pages/Football/Player.jsx";
import Analytics from "../pages/Football/Analytics";
import Blogs from "../pages/Blogs";
import FootballScoresDashboard from "../pages/Football/MatchList";
import FootballRankings from "../pages/Football/Rankings";

export default function FootballRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/match-list/:type" element={<FootballScoresDashboard />} />

        {/* Rankings */}
        <Route path="/rankings" element={<FootballRankings />} />
        <Route path="/rankings/:tab" element={<FootballRankings />} />
        <Route
          path="/rankings/scores"
          element={<FootballRankings type="scorers" />}
        />
        <Route
          path="/rankings/assists"
          element={<FootballRankings type="assists" />}
        />

        <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </div>
  );
}
