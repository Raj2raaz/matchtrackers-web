import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { footballApiClient } from "../../utils/axios";
import { Helmet } from "react-helmet-async";

const FootballScoresDashboard = () => {
  const { type } = useParams(); // "recent" | "live" | "upcoming"
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        let response;

        if (type === "recent") {
          response = await footballApiClient.get(
            `/v3/fixtures?league=39&season=2024&last=20`
          );
        } else if (type === "live") {
          response = await footballApiClient.get(`/v3/fixtures?live=all`);
        } else if (type === "upcoming") {
          response = await footballApiClient.get(
            `/v3/fixtures?league=39&season=2024&next=20`
          );
        }

        setFixtures(response?.data?.response || []);
      } catch (err) {
        console.error("Error fetching football matches:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center">
          {/* Spinner animation */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 animate-pulse">
            Loading football data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center text-center">
          {/* Error animation effect */}
          <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 animate-bounce">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Error fetching football matches.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 m-5  text-black dark:text-gray-200">
      <Helmet>
        <title>Football {type} matches</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6 capitalize text-center  text-black dark:text-gray-200">
        Football – {type} matches
      </h1>

      {fixtures.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No matches found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fixtures.map((fixture) => (
            <div
              key={fixture.fixture.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
            >
              {/* Match Date & League */}
              <div className="flex justify-between items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(fixture.fixture.date).toLocaleString()}</span>
                <span className="font-medium">{fixture.league.name}</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col items-center">
                  <img
                    src={fixture.teams.home.logo}
                    alt={fixture.teams.home.name}
                    className="w-12 h-12 mb-2"
                  />
                  <span className="text-sm font-medium text-center">
                    {fixture.teams.home.name}
                  </span>
                </div>

                <span className="font-bold text-lg text-gray-700 dark:text-gray-200">
                  vs
                </span>

                <div className="flex flex-col items-center">
                  <img
                    src={fixture.teams.away.logo}
                    alt={fixture.teams.away.name}
                    className="w-12 h-12 mb-2"
                  />
                  <span className="text-sm font-medium text-center">
                    {fixture.teams.away.name}
                  </span>
                </div>
              </div>

              {/* Match Status */}
              <div className="mt-5 text-center text-sm font-medium">
                <span
                  className={`px-3 py-1 rounded-full ${
                    fixture.fixture.status.short === "FT"
                      ? "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300"
                      : fixture.fixture.status.short === "NS"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
                  }`}
                >
                  {fixture.fixture.status.long}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FootballScoresDashboard;
