import React, { useEffect, useState } from "react";
import { footballApiClient } from "../../utils/axios";
import data from "../../football.json";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import Player from "../Football/Player.jsx";

export default function FootballRankings() {
  const [selectedLeague, setSelectedLeague] = useState(data.topleagues[0]);
  const [selectedSeason, setSelectedSeason] = useState(
    data.topleagues[0].seasons[0]
  );
  const [isLeagueDropdownOpen, setIsLeagueDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

  const [scorers, setScorers] = useState([]);
  const [assists, setAssists] = useState([]);
  const [activeTab, setActiveTab] = useState("scorers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError("");
      try {
        const scorersRes = await footballApiClient.get(
          `/v3/players/topscorers?league=${selectedLeague.id}&season=${selectedSeason}`
        );
        setScorers(scorersRes.data?.response || []);

        const assistsRes = await footballApiClient.get(
          `/v3/players/topassists?league=${selectedLeague.id}&season=${selectedSeason}`
        );
        setAssists(assistsRes.data?.response || []);
      } catch (err) {
        setError("Failed to fetch rankings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedLeague, selectedSeason]);

  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    setSelectedSeason(league.seasons[0]);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setIsSeasonDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        ⚽ Football Rankings –{" "}
        <span className="text-blue-600 dark:text-blue-400">
          {selectedLeague.name}
        </span>
      </h1>

      {/* League + Season Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* League Dropdown (with logos) */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setIsLeagueDropdownOpen((prev) => !prev)}
          >
            <img
              src={selectedLeague.logo}
              alt={selectedLeague.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{selectedLeague.name}</span>
            {isLeagueDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isLeagueDropdownOpen && (
            <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-56 border border-gray-200 dark:border-gray-700 animate-fade-in max-h-64 overflow-y-auto">
              {data.topleagues.map((league) => (
                <div
                  key={league.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => {
                    handleLeagueSelect(league);
                    setIsLeagueDropdownOpen(false);
                  }}
                >
                  <img
                    src={league.logo}
                    alt={league.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{league.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Season Dropdown (already custom) */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setIsSeasonDropdownOpen((prev) => !prev)}
          >
            {selectedSeason}
            {isSeasonDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isSeasonDropdownOpen && (
            <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full border border-gray-200 dark:border-gray-700 animate-fade-in">
              {selectedLeague.seasons.map((season) => (
                <div
                  key={season}
                  className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => handleSeasonSelect(season)}
                >
                  {season}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("scorers")}
          className={`px-6 py-2 rounded-l-xl font-medium transition ${
            activeTab === "scorers"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Top Scorers
        </button>
        <button
          onClick={() => setActiveTab("assists")}
          className={`px-6 py-2 rounded-r-xl font-medium transition ${
            activeTab === "assists"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Top Assists
        </button>
      </div>

      {/* State handling */}
      {loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
          Loading rankings...
        </div>
      )}
      {error && (
        <div className="text-center text-red-500 font-medium">{error}</div>
      )}

      {/* Player Cards */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(activeTab === "scorers" ? scorers : assists)?.length > 0 ? (
            (activeTab === "scorers" ? scorers : assists).map((item, index) => (
              <Link
                key={item.player.id}
                to={`/football/player/${item.player.id}`}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={item.player.photo}
                    alt={item.player.name}
                    className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                  />
                  <div>
                    <h2 className="font-bold text-lg">{item.player.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.statistics[0].team.name}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Rank #{index + 1}
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {activeTab === "scorers"
                      ? item.statistics[0].goals.total
                      : item.statistics[0].goals.assists}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500 col-span-full">
              No data available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
