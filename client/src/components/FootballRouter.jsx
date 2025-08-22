import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Football/Landing";
import Match from "../pages/Football/Match";
import Player from "../pages/Football/Player";
import Analytics from "../pages/Football/Analytics";
import Blogs from "../pages/Blogs";

export default function FootballRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/analytics" element={<Analytics />} />

        <Route path="/blogs" element={<Blogs />} />
      </Routes>
    </div>
  );
}
