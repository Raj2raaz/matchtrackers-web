import React, { useEffect, useState } from "react";
import Hightlights from "../../components/football/Hightlights";
import data from "../../football.json";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { ChevronRight } from "lucide-react";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { footballApiClient } from "../../utils/axios";
import {
  Calendar,
  MapPin,
  Timer,
  TrendingUp,
  Award,
  Trophy,
  Star,
  Shuffle,
  ArrowRight,
} from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [noOfRecentMatches, setNoOfRecentMatches] = useState(5);
  const [selectedLeague, setSelectedLeague] = useState(data.topleagues[0]);
  const [selectedSeason, setSelectedSeason] = useState(
    data.topleagues[0].seasons[0]
  );
  const [activeTab, setActiveTab] = useState("scorers");
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [scorers, setScorers] = useState([]);
  const [assists, setAssists] = useState([]);
  const navigate = useNavigate();
  const [matchLength, setMatchLength] = useState(8);

  useEffect(() => {
    const getMatches = async () => {
      setLoading(true);
      try {
        const response = await footballApiClient.get(
          `/v3/fixtures?league=${selectedLeague.id}&season=${selectedSeason}&last=20`
        );
        setMatches(response.data.response);

        const scorers = await footballApiClient.get(
          `/v3/players/topscorers?league=${selectedLeague.id}&season=${selectedSeason}`
        );
        setScorers(scorers.data.response);

        const assists = await footballApiClient.get(
          `/v3/players/topassists?league=${selectedLeague.id}&season=${selectedSeason}`
        );
        setAssists(assists.data.response);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, [selectedLeague, selectedSeason]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    setSelectedSeason(league.seasons[0]);
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setIsSeasonDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        <img
          src="https://images7.alphacoders.com/932/932701.jpg"
          className="h-full w-full object-cover"
          alt="Football stadium"
        />

        {/* Improved gradient overlay
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>

         Content container 
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-blue-400 dark:text-blue-300">MatchTrackers</span>
          </h1>
          <p className="text-white text-lg md:text-xl mb-6 max-w-2xl">
            Follow every goal, every play, every moment. Get instant match
            updates and scores from the world's top leagues.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-300 text-lg shadow-lg dark:bg-blue-700 dark:hover:bg-blue-600">
            Start Tracking Now
          </button>
        </div> */}
      </div>

      {/* Highlights Section */}
      <Hightlights />

      {/* Main Content */}
      <div className="container mx-auto md:px-24 px-4 my-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Leagues Section - Now with Season Selector */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* League & Season Selector Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-white font-semibold text-xl">
                    Top Leagues
                  </h2>
                </div>
              </div>

              {/* Leagues List */}
              <div className="p-4">
                <div className="space-y-2">
                  {data.topleagues.length > 0 ? (
                    data.topleagues
                      .slice(0, noOfRecentMatches)
                      .map((league, i) => (
                        <div
                          key={i}
                          onClick={() => handleLeagueSelect(league)}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            selectedLeague.id === league.id
                              ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                              : "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={league.logo}
                              className="h-8 w-8 rounded-full object-cover"
                              alt={league.name}
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">
                                {league.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {league.country.name}
                              </p>
                            </div>
                          </div>
                          <IoMdArrowDroprightCircle
                            size={24}
                            className={
                              selectedLeague.id === league.id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400 dark:text-gray-500"
                            }
                          />
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic py-4 text-center">
                      No leagues available
                    </p>
                  )}
                </div>

                {/* See More/Less Button */}
                {data.topleagues.length > 5 && (
                  <button
                    onClick={() => {
                      if (noOfRecentMatches < data.topleagues.length) {
                        setNoOfRecentMatches(data.topleagues.length);
                      } else {
                        setNoOfRecentMatches(5);
                      }
                    }}
                    className="flex items-center justify-center w-full mt-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                  >
                    {noOfRecentMatches >= data.topleagues.length
                      ? "Show Less"
                      : "Show More"}
                    {noOfRecentMatches >= data.topleagues.length ? (
                      <IoChevronUp className="ml-1" />
                    ) : (
                      <IoChevronDown className="ml-1" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 mt-5 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md max-w-md">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={selectedLeague.logo}
                    alt={selectedLeague.name}
                    className="h-8 w-8 rounded-full bg-white p-1"
                  />
                  <h1 className="font-bold text-xl">{selectedLeague.name}</h1>
                  <div className="ml-auto bg-blue-800 bg-opacity-40 rounded-full px-3 py-1 text-xs font-medium">
                    {selectedSeason}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center bg-blue-800 bg-opacity-30 rounded-lg px-3 py-1 text-sm">
                    <Star size={14} className="mr-1 text-yellow-300" />
                    <span>Top Performers</span>
                  </div>
                  <p className="text-blue-100 text-xs">Season stats</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("scorers")}
                  className={`flex-1 flex items-center justify-center py-3 px-2 font-medium text-sm ${
                    activeTab === "scorers"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Trophy
                    size={16}
                    className={`mr-2 ${
                      activeTab === "scorers"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  Top Scorers
                </button>
                <button
                  onClick={() => setActiveTab("assisters")}
                  className={`flex-1 flex items-center justify-center py-3 px-2 font-medium text-sm ${
                    activeTab === "assisters"
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Shuffle
                    size={16}
                    className={`mr-2 ${
                      activeTab === "assisters"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  Top Assisters
                </button>
              </div>

              {/* Content */}
              <div className="p-2">
                {activeTab === "scorers" && (
                  <div>
                    {scorers.map((item, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          navigate("/football/player/" + item.player.id)
                        }
                        className="flex cursor-pointer items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full
                    ${
                      i === 0
                        ? "bg-green-500 text-white"
                        : i === 1
                        ? "bg-yellow-300 text-gray-800"
                        : i === 2
                        ? "bg-blue-700 text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                          >
                            {i + 1}
                          </div>
                          <div className="relative">
                            <img
                              src={item.player.photo}
                              alt=""
                              className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
                            />
                            <img
                              src={item.statistics[0].team.logo}
                              alt=""
                              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border border-white dark:border-gray-800 bg-white dark:bg-gray-800"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate dark:text-gray-100">
                              {item.player.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.statistics[0].team.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold text-sm px-2 py-1 rounded">
                            {item.statistics[0].goals.total}
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "assisters" && (
                  <div>
                    {assists.slice(10).map((item, i) => (
                      <div
                        onClick={() =>
                          navigate("/football/player/" + item.player.id)
                        }
                        key={i}
                        className="flex cursor-pointer items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full
                    ${
                      i === 0
                        ? "bg-green-500 text-white"
                        : i === 1
                        ? "bg-yellow-300 text-gray-800"
                        : i === 2
                        ? "bg-blue-700 text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                          >
                            {i + 1}
                          </div>
                          <div className="relative">
                            <img
                              src={item.player.photo}
                              alt=""
                              className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover"
                            />
                            <img
                              src={item.statistics[0].team.logo}
                              alt=""
                              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border border-white dark:border-gray-800 bg-white dark:bg-gray-800"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate dark:text-gray-100">
                              {item.player.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.statistics[0].team.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-bold text-sm px-2 py-1 rounded">
                            {item.statistics[0].goals.assists}
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 px-2">
                  <button className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-sm font-medium py-2 rounded-md flex items-center justify-center">
                    View complete stats{" "}
                    <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Matches Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Matches Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-white font-semibold text-xl flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {selectedLeague.name}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Season {selectedSeason}
                    </p>
                  </div>
                  {/* Season Selector */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsSeasonDropdownOpen(!isSeasonDropdownOpen)
                      }
                      className="bg-white dark:bg-gray-700 text-blue-800 dark:text-white py-1 px-3 rounded-md flex items-center text-sm font-medium"
                    >
                      Season: {selectedSeason}
                      {isSeasonDropdownOpen ? (
                        <IoChevronUp className="ml-1" />
                      ) : (
                        <IoChevronDown className="ml-1" />
                      )}
                    </button>

                    {/* Season Dropdown */}
                    {isSeasonDropdownOpen && (
                      <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 max-h-56 overflow-y-auto">
                        {selectedLeague.seasons.map((season, index) => (
                          <button
                            key={index}
                            onClick={() => handleSeasonSelect(season)}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              selectedSeason === season
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                                : "hover:bg-gray-100 dark:hover:bg-gray-600"
                            }`}
                          >
                            {season}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* No Matches State */}
              {!loading && (!matches || matches.length === 0) && (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No matches available for this selection.
                  </p>
                </div>
              )}

              {/* Matches List */}
              {!loading && matches && matches.length > 0 && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {matches.slice(0, matchLength).map((match, index) => (
                    <div
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Match Date & Venue */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex flex-wrap justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center mb-1 md:mb-0">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(match.fixture.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          <span>
                            {match.fixture.venue.name},{" "}
                            {match.fixture.venue.city}
                          </span>
                        </div>
                      </div>

                      {/* Match Teams & Score */}
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          {/* Home Team */}
                          <div className="flex items-center w-full md:w-5/12 justify-end md:justify-start mb-3 md:mb-0">
                            <div className="flex flex-row-reverse md:flex-row items-center">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600 ml-3 md:mr-3 md:ml-0">
                                <img
                                  src={match.teams.home.logo}
                                  alt={match.teams.home.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span
                                className={`font-medium text-right md:text-left ${
                                  match.teams.home.winner
                                    ? "text-green-600 dark:text-green-400"
                                    : "dark:text-gray-100"
                                }`}
                              >
                                {match.teams.home.name}
                              </span>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="flex flex-col items-center justify-center w-full md:w-2/12 mx-4 mb-3 md:mb-0">
                            <div className="flex items-center">
                              <span className="text-xl font-bold px-2 dark:text-white">
                                {match.goals.home}
                              </span>
                              <span className="text-gray-400 font-medium">
                                -
                              </span>
                              <span className="text-xl font-bold px-2 dark:text-white">
                                {match.goals.away}
                              </span>
                            </div>
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${
                                match.fixture.status.short === "FT"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                              }`}
                            >
                              {match.fixture.status.long}
                            </span>
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center w-full md:w-5/12 justify-start md:justify-end">
                            <div className="flex flex-row md:flex-row-reverse items-center">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600 mr-3 md:ml-3 md:mr-0">
                                <img
                                  src={match.teams.away.logo}
                                  alt={match.teams.away.name}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span
                                className={`font-medium text-left md:text-right ${
                                  match.teams.away.winner
                                    ? "text-green-600 dark:text-green-400"
                                    : "dark:text-gray-100"
                                }`}
                              >
                                {match.teams.away.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Details */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs">
                        <div className="flex flex-wrap gap-3 mb-2 sm:mb-0">
                          <span className="flex items-center text-gray-600 dark:text-gray-300">
                            <Timer size={14} className="mr-1" />
                            HT: {match.score.halftime.home}-
                            {match.score.halftime.away}
                          </span>
                          <span className="flex items-center text-gray-600 dark:text-gray-300">
                            <TrendingUp size={14} className="mr-1" />
                            FT: {match.score.fulltime.home}-
                            {match.score.fulltime.away}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            navigate("/football/match/" + match.fixture.id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer dark:bg-blue-700 dark:hover:bg-blue-600"
                        >
                          View match
                        </button>
                        <div>
                          <span className="flex items-center text-gray-600 dark:text-gray-300">
                            <Award size={14} className="mr-1" />
                            {match.league.round}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (matchLength < matches.length)
                      setMatchLength(matches.length);
                    else setMatchLength(10);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 my-2 items-center text-white px-3 py-1 flex gap-2 rounded text-sm font-medium dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {matchLength >= matches?.length ? "see less" : "see more"}
                  {matchLength >= matches?.length ? (
                    <FaChevronUp className="mt-1" />
                  ) : (
                    <FaChevronDown className="mt-1" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
