import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Player from "../pages/Player";
import Schedules from "../pages/Schedules";
import PointsTable from "../pages/PointsTable";
import Match from "../pages/Match";
import CricketScoresDashboard from "../pages/MatchList";
import Rankings from "../pages/Rankings";
import NewsPage from "../pages/News";
import AuthForm from "../pages/Auth";
import AnalyticsRouter from "./AnalyticsRouter";
import Gallery from "./Gallery";
import AllNews from "../pages/AllNews";

export default function CricketRouter() {
  const PaddedLayout = ({ children }) => {
    return <div className="px-2 md:px-24 md:py-8">{children}</div>;
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/player/:id"
          element={
            <PaddedLayout>
              <Player />
            </PaddedLayout>
          }
        />
        <Route
          path="/schedules/:id"
          element={
            <PaddedLayout>
              <Schedules />
            </PaddedLayout>
          }
        />
        <Route
          path="/points-table/:id"
          element={
            <PaddedLayout>
              <PointsTable />
            </PaddedLayout>
          }
        />
        <Route
          path="/match/:id"
          element={
            <PaddedLayout>
              <Match />
            </PaddedLayout>
          }
        />
        <Route
          path="/match-list/:type"
          element={
            <PaddedLayout>
              <CricketScoresDashboard />
            </PaddedLayout>
          }
        />
        <Route
          path="/rankings/:type"
          element={
            <PaddedLayout>
              <Rankings />
            </PaddedLayout>
          }
        />
        <Route
          path="/news/:id"
          element={
            <PaddedLayout>
              <NewsPage />
            </PaddedLayout>
          }
        />

        <Route
          path="/analytics/*"
          element={
            <PaddedLayout>
              <AnalyticsRouter />
            </PaddedLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <PaddedLayout>
              <Gallery />
            </PaddedLayout>
          }
        />
        <Route
          path="/all-news"
          element={
            <PaddedLayout>
              <AllNews />
            </PaddedLayout>
          }
        />
      </Routes>
    </div>
  );
}
