import React from "react";
import { Route, Routes } from "react-router-dom";
import Analytics from "../pages/Analytics";
import AnalyticsMatch from "../pages/AnalyticsMatch";

export default function AnalyticsRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Analytics />} />
        <Route path="/match/:id" element={<AnalyticsMatch />} />
      </Routes>
    </div>
  );
}
