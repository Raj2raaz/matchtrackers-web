import React, { useState, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import {
  BsChevronRight,
  BsSearch,
  BsChevronDown,
  BsChevronUp,
  BsStarFill,
  BsStar,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { CgChevronDoubleDown, CgChevronDoubleUp } from "react-icons/cg";
import { Star } from "lucide-react";
import Image from "../components/Image";
import findTournamentIdAndFetchOdds from "../utils/getOdds";
import TimeDisplay from "../components/TimeDisplay";
import useCricbuzzStore from "../store/cricket";
import Cookies from "js-cookie";
import useMainStore from "../store/MainStore";
import data from "../data.json";
import { cricApiClient as apiClient } from "../utils/axios"; // Make sure this is imported correctly
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const Analytics = () => {
  // State management
  const [activeTab, setActiveTab] = useState("All");
  const [matchType, setMatchType] = useState("upcoming");
  const [recentMatches, setRecentMatches] = useState(data.highlights);
  const [noOfRecentMatches, setNoOfRecentMatches] = useState(7);
  const [showOdds, setShowOdds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("league");
  const [matchOdds, setMatchOdds] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [visibleMatches, setVisibleMatches] = useState(8);
  const { content, refresh, refreshNow } = useMainStore();
  const [matchData, setMatchData] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [isOddsLoading, setIsOddsLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  // Fetch data based on match type
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `/matches/v1/${matchType.toLowerCase()}`
        );
        setMatchData(response.data);
      } catch (error) {
        console.log(error);
        // Fallback to static data if API fails
        // setMatchData(data.leagueMatches[matchType.toLowerCase()] || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [matchType]);

  const addMatchToFavorites = async (matchId, data) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please login to manage favorites");
        return;
      }

      const isFavorited = userData?.favorites?.matches?.some(
        (match) => match.matchId === matchId
      );

      if (isFavorited) {
        // Call DELETE to remove from favorites
        await axios.delete(`/api/favorites/match/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Match removed from favorites!");
      } else {
        // Call POST to add to favorites
        await axios.post(
          "/api/favorites/match",
          { matchId: matchId, data: JSON.stringify(data) },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Match added to favorites!");
      }
    } catch (error) {
      console.error("Error toggling favorite match:", error);
      toast.error(
        error?.response?.data?.error || "Failed to toggle favorite match"
      );
    } finally {
      refreshNow();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.log(error);
        // toast.error("Error fetching user try again");
      }
    };

    fetchUser();
  }, [refresh]);

  // Filter competitions based on search
  const filteredCompetitions = useMemo(() => {
    if (!searchFilter) return data.Categories;
    return data.Categories.filter((country) =>
      country.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  // Handle match type selection
  const handleMatchTypeChange = useCallback((type) => {
    setMatchType(type);
  }, []);

  // Handle tab selection
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Handle section change
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
  }, []);

  // Handle toggle for recent matches
  const toggleRecentMatches = useCallback(() => {
    if (noOfRecentMatches < recentMatches.length) {
      setNoOfRecentMatches(noOfRecentMatches + 5);
    } else {
      setNoOfRecentMatches(7);
    }
  }, [noOfRecentMatches, recentMatches.length]);

  // Fetch match odds
  const fetchMatchOdds = useCallback(async (match, matchId) => {
    try {
      setIsOddsLoading(true);
      setSelectedMatchId(matchId);

      // Clear previous odds data to ensure UI updates when switching matches
      setMatchOdds(null);

      const oddsData = await findTournamentIdAndFetchOdds(
        match.matchInfo.team1.teamSName,
        match.matchInfo.team2.teamSName,
        match.matchInfo.startDate,
        0
      );

      setMatchOdds({
        markets: oddsData.markets,
        matchInfo: {
          team1: match.matchInfo.team1.teamSName,
          team2: match.matchInfo.team2.teamSName,
          time: match.matchInfo.startDate,
          imgs: [match.matchInfo.team1.imageId, match.matchInfo.team2.imageId],
        },
      });
    } catch (error) {
      console.error("Failed to fetch odds:", error);
      toast.error("Failed to fetch match odds");
    } finally {
      setIsOddsLoading(false);
    }
  }, []);

  // Load more matches
  const loadMoreMatches = useCallback(() => {
    setVisibleMatches((prev) => prev + 4);
  }, []);

  // Get visible matches
  const getVisibleMatches = useMemo(() => {
    if (isLoading) return [];

    const allMatches = [];
    // Filter based on active section
    const filteredData = matchData
      ? matchData?.typeMatches?.filter(
          (data) =>
            data.matchType.toLowerCase() === activeSection ||
            (activeSection === "league" && data.matchType === "League") ||
            activeSection === "all"
        )
      : [];

    filteredData?.forEach((categoryData) => {
      categoryData.seriesMatches.forEach((seriesMatch) => {
        if (seriesMatch.seriesAdWrapper) {
          seriesMatch.seriesAdWrapper.matches.forEach((match) => {
            allMatches.push({
              match,
              seriesName: seriesMatch.seriesAdWrapper.seriesName,
              id: `${match.matchInfo.matchId}-${match.matchInfo.team1.teamId}-${match.matchInfo.team2.teamId}`,
            });
          });
        }
      });
    });

    return allMatches.slice(0, visibleMatches);
  }, [visibleMatches, matchData, activeSection, isLoading]);

  const hasMoreMatches = useMemo(() => {
    if (!matchData) return false;

    let totalMatches = 0;
    matchData &&
      matchData?.typeMatches?.forEach((categoryData) => {
        categoryData.seriesMatches.forEach((seriesMatch) => {
          if (seriesMatch.seriesAdWrapper) {
            totalMatches += seriesMatch.seriesAdWrapper.matches.length;
          }
        });
      });
    return visibleMatches < totalMatches;
  }, [visibleMatches, matchData]);

  // Handle match selection
  const handleMatchSelect = useCallback(
    (match, matchId) => {
      fetchMatchOdds(match, matchId);
    },
    [fetchMatchOdds]
  );

  const [show, setShow] = useState(false);

  return (
    <div className="">
      <Helmet>
        <title>Match Trackers | Live Scores, Stats & News</title>
        <meta
          name="description"
          content="Track live matches, player stats, rankings, and news across all formats and leagues at Match Trackers."
        />

        {/* Open Graph (Facebook, WhatsApp, etc.) */}
        <meta
          property="og:title"
          content="Match Trackers | Live Scores, Stats & News"
        />
        <meta
          property="og:description"
          content="Track live matches, player stats, rankings, and news across all formats and leagues."
        />
        <meta
          property="og:image"
          content="https://matchtrackers.com/favicon.svg"
        />
        <meta property="og:url" content="https://matchtrackers.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Match Trackers | Live Scores, Stats & News"
        />
        <meta
          name="twitter:description"
          content="Get updated with the latest scores, rankings and sports news."
        />
        <meta
          name="twitter:image"
          content="https://matchtrackers.com/favicon.svg"
        />
      </Helmet>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Cricket Live Score & Prediction
          </h1>
          <BsChevronRight className="text-gray-400" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="w-full order-3 md:order-1 lg:w-1/4">
            {/* Recent Highlights */}
            <div className="bg-white shadow-md rounded-lg mb-6 border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Highlights
              </h2>
              <div className="text-sm text-gray-700">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded-full"
                      ></div>
                    ))}
                  </div>
                ) : content === "cricket" ? (
                  recentMatches && recentMatches.length > 0 ? (
                    recentMatches.slice(0, noOfRecentMatches).map((e, i) =>
                      e.seriesAdWrapper ? (
                        <div
                          key={i}
                          className="bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer flex justify-between items-center mt-2 pl-4 pr-3 py-2 rounded-full"
                        >
                          <p className="truncate max-w-[14rem] overflow-hidden whitespace-nowrap font-medium">
                            {e.seriesAdWrapper.seriesName}
                          </p>
                          <BsStar
                            size={18}
                            className="text-gray-500 hover:text-yellow-500 transition-colors"
                          />
                        </div>
                      ) : null
                    )
                  ) : (
                    <p className="text-gray-500 italic">
                      No recent matches available
                    </p>
                  )
                ) : (
                  <p className="text-gray-500 italic">No leagues available</p>
                )}
              </div>
              {!isLoading && recentMatches && recentMatches.length > 0 && (
                <button
                  onClick={toggleRecentMatches}
                  className="flex items-center justify-center w-full mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {noOfRecentMatches >= recentMatches.length
                    ? "See Less"
                    : "See More"}{" "}
                  {noOfRecentMatches >= recentMatches.length ? (
                    <CgChevronDoubleUp size={16} className="ml-1" />
                  ) : (
                    <CgChevronDoubleDown size={16} className="ml-1" />
                  )}
                </button>
              )}
            </div>

            {/* Competitions */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                All competitions
              </h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Filter competitions"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-gray-50 p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <BsSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <ul className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredCompetitions.map((country, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={`https://www.sofascore.com/static/images/flags/${
                          country.alpha2?.toLowerCase() || country.flag
                        }.png`}
                        className="h-6 w-8 object-cover"
                        alt={country.name}
                      />
                      <span className="font-medium text-gray-700">
                        {country.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {country.count && (
                        <span className="text-gray-500 text-sm mr-2">
                          {country.count}
                        </span>
                      )}
                      <FaChevronDown className="text-gray-400 text-xs" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Middle column - Match listings */}
          <div className="w-full order-1 md:order-2 lg:w-2/5">
            <div className="bg-white rounded-lg shadow-md">
              {/* Tabs and filters */}
              <div className="">
                <div className="flex items-center border-b border-gray-200 px-2 pt-2">
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "All"
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                        : "text-gray-600"
                    } transition-colors`}
                    onClick={() => handleTabChange("All")}
                  >
                    All
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      activeTab === "Favourites"
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                        : "text-gray-600"
                    } transition-colors`}
                    onClick={() => handleTabChange("Favourites")}
                  >
                    Favourites
                  </button>
                </div>
              </div>

              {/* Section filters */}
              {activeTab === "All" ? (
                <div>
                  <div className="px-4 pb-3 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2 mt-4">
                      {["league", "international", "domestic", "women"].map(
                        (section) => (
                          <button
                            key={section}
                            className={`py-2 px-4 text-sm rounded-md transition-colors ${
                              activeSection === section
                                ? "bg-blue-800 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => handleSectionChange(section)}
                          >
                            {section.toUpperCase()}
                          </button>
                        )
                      )}
                    </div>
                    <div className="flex mt-4">
                      <button
                        className={`px-5 py-1.5 rounded-full transition-colors mx-1 ${
                          matchType === "Live"
                            ? "bg-red-100 text-red-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleMatchTypeChange("Live")}
                      >
                        Live
                      </button>
                      <button
                        className={`px-5 py-1.5 rounded-full transition-colors mx-1 ${
                          matchType === "Recent"
                            ? "bg-gray-100 text-gray-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleMatchTypeChange("Recent")}
                      >
                        Recent
                      </button>
                      <button
                        className={`px-5 py-1.5 rounded-full transition-colors mx-1 ${
                          matchType === "upcoming"
                            ? "bg-gray-100 text-gray-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => handleMatchTypeChange("Upcoming")}
                      >
                        Upcoming
                      </button>
                    </div>
                  </div>
                  {/* Match listings */}
                  <div className="divide-y divide-gray-100">
                    {isLoading ? (
                      // Loading state
                      <div className="p-4">
                        <div className="animate-pulse space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                  </div>
                                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                  </div>
                                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                              </div>
                              <div className="h-6 bg-gray-200 rounded w-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : getVisibleMatches.length > 0 ? (
                      getVisibleMatches.map((matchData, idx) => {
                        const { match, seriesName, id } = matchData;
                        const isSelected = selectedMatchId === id;
                        return (
                          <div
                            key={`match-${id}`}
                            className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleMatchSelect(match, id)}
                          >
                            <div className="text-xs flex justify-between items-center text-gray-500 mb-2 font-medium relative">
                              <p>{seriesName}</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevents the click from reaching the parent
                                  navigate(
                                    "/cricket/analytics/match/" +
                                      matchData.match.matchInfo.matchId
                                  );
                                }}
                                className="bg-secondary text-base text-white px-3 py-0.5 rounded"
                              >
                                View Match
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">
                              {match.matchInfo.matchDesc} •{" "}
                              {match.matchInfo.venueInfo.ground},{" "}
                              {match.matchInfo.venueInfo.city}
                            </div>
                            <div className="space-y-4">
                              {/* Team 1 */}
                              <div className="flex justify-between items-center">
                                <div className="font-medium flex items-center gap-3">
                                  <Image
                                    faceImageId={match.matchInfo.team1.imageId}
                                    className="rounded-full h-8 w-8 object-cover shadow-sm"
                                  />
                                  <span>{match.matchInfo.team1.teamName}</span>
                                </div>
                                {match.matchScore?.team1Score?.inngs1 ? (
                                  <div className="font-medium">
                                    {match.matchScore.team1Score.inngs1.runs}-
                                    {match.matchScore.team1Score.inngs1.wickets}
                                    <span className="text-gray-500 text-sm ml-1">
                                      (
                                      {match.matchScore.team1Score.inngs1.overs}{" "}
                                      ov)
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
                              {/* Team 2 */}
                              <div className="flex justify-between items-center">
                                <div className="font-medium flex items-center gap-3">
                                  <Image
                                    faceImageId={match.matchInfo.team2.imageId}
                                    className="rounded-full h-8 w-8 object-cover shadow-sm"
                                  />
                                  <span>{match.matchInfo.team2.teamName}</span>
                                </div>
                                {match.matchScore?.team2Score?.inngs1 ? (
                                  <div className="font-medium">
                                    {match.matchScore.team2Score.inngs1.runs}-
                                    {match.matchScore.team2Score.inngs1.wickets}
                                    <span className="text-gray-500 text-sm ml-1">
                                      (
                                      {match.matchScore.team2Score.inngs1.overs}{" "}
                                      ov)
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    match.matchInfo.state === "In Progress"
                                      ? "bg-red-100 text-red-600"
                                      : match.matchInfo.state === "Rain"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {match.matchInfo.state}
                                </span>
                                <span className="text-gray-600 text-sm">
                                  {match.matchInfo.status}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addMatchToFavorites(
                                    match?.matchInfo?.matchId,
                                    {
                                      seriesName: seriesName,
                                      desc: match.matchInfo.matchDesc,
                                      ground: match.matchInfo.venueInfo.ground,
                                      city: match.matchInfo.venueInfo.city,
                                      status: match.matchInfo.status,
                                      state: match.matchInfo.state,
                                      team1Name: match.matchInfo.team1.teamName,
                                      team2Name: match.matchInfo.team2.teamName,
                                      imgs: [
                                        match.matchInfo.team1.imageId,
                                        match.matchInfo.team2.imageId,
                                      ],
                                    }
                                  );
                                }}
                                className={`p-2 cursor-pointer transition-colors ${
                                  userData?.favorites?.matches?.some(
                                    (fmatch) =>
                                      fmatch.matchId ===
                                      match?.matchInfo?.matchId
                                  )
                                    ? "text-yellow-500"
                                    : "text-gray-400 hover:text-yellow-500"
                                }`}
                                aria-label="Show match odds"
                              >
                                {userData?.favorites?.matches?.some(
                                  (fmatch) =>
                                    fmatch.matchId === match?.matchInfo?.matchId
                                ) ? (
                                  <BsStarFill size={18} />
                                ) : (
                                  <Star size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No matches available</p>
                      </div>
                    )}
                    {/* See more button */}
                    {hasMoreMatches && (
                      <div className="p-4 flex justify-center">
                        <button
                          onClick={loadMoreMatches}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          See More <CgChevronDoubleDown size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[30rem] divide-y divide-gray-300  ">
                  {userData?.favorites?.matches?.length > 0 ? (
                    userData?.favorites?.matches?.map((e, i) => {
                      const match = JSON.parse(e.matchData);

                      return (
                        <div
                          key={`match-${i}`}
                          className={`p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                            false ? "bg-blue-50" : ""
                          }`}
                          // onClick={() => handleMatchSelect(match, id)}
                        >
                          <div className="text-xs flex justify-between items-center text-gray-500 mb-2 font-medium relative">
                            <p>{match?.seriesName}</p>
                            <button
                              onClick={(el) => {
                                el.stopPropagation(); // Prevents the click from reaching the parent
                                navigate(
                                  "/cricket/analytics/match/" + e.matchId
                                );
                              }}
                              className="bg-secondary text-base text-white px-3 py-0.5 rounded"
                            >
                              View Match
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mb-3">
                            {match?.desc} • {match?.ground}, {match?.city}
                          </div>
                          <div className="space-y-4">
                            {/* Team 1 */}
                            <div className="flex justify-between items-center">
                              <div className="font-medium flex items-center gap-3">
                                <Image
                                  faceImageId={match?.imgs[0]}
                                  className="rounded-full h-8 w-8 object-cover shadow-sm"
                                />
                                <span>{match?.team1Name}</span>
                              </div>

                              <span className="text-gray-400">-</span>
                            </div>
                            {/* Team 2 */}
                            <div className="flex justify-between items-center">
                              <div className="font-medium flex items-center gap-3">
                                <Image
                                  faceImageId={match?.imgs[1]}
                                  className="rounded-full h-8 w-8 object-cover shadow-sm"
                                />
                                <span>{match?.team2Name}</span>
                              </div>

                              <span className="text-gray-400">-</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 text-sm">
                                {match?.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center my-10 text-gray-500">
                      No Matches Found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column - Featured match */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0 order-2 md:order-3 ">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-800">
                  Featured Match
                </h2>
              </div>

              {isOddsLoading ? (
                <div className="p-8">
                  <div className="animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 mt-2"></div>
                      </div>
                    </div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : matchOdds?.markets?.length > 0 ? (
                <div className="p-5">
                  {/* Existing odds display code here */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col items-center">
                      <Image
                        className="h-12 w-12 rounded-full shadow-sm"
                        faceImageId={matchOdds.matchInfo.imgs[0]}
                      />
                      <span className="font-medium mt-2 text-gray-800">
                        {matchOdds.matchInfo.team1}
                      </span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <div className="text-xs font-semibold text-gray-500 mb-1">
                        VS
                      </div>
                      <TimeDisplay startTimestamp={matchOdds.matchInfo.time} />
                    </div>

                    <div className="flex flex-col items-center">
                      <Image
                        className="h-12 w-12 rounded-full shadow-sm"
                        faceImageId={matchOdds.matchInfo.imgs[1]}
                      />
                      <span className="font-medium mt-2 text-gray-800">
                        {matchOdds.matchInfo.team2}
                      </span>
                    </div>
                  </div>

                  {/* Odds markets */}
                  <div className="space-y-4">
                    {matchOdds.markets.map((market) => (
                      <div
                        key={market.id}
                        className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center border-b border-blue-200 pb-2 mb-3">
                          <p className="text-lg font-bold text-gray-800">
                            {market.marketName}
                          </p>
                          <img
                            className="h-5"
                            src="https://matchtrackers.com/assets/navLogo-CDr_GOtB.svg"
                            alt="Match Trackers logo"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          {market.choices.map((choice) => (
                            <div
                              key={choice.sourceId}
                              className="flex flex-col items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                            >
                              <p className="font-medium text-gray-700">
                                {choice.name}
                              </p>
                              <p className="text-lg font-bold text-blue-700 mt-1">
                                {choice.fractionalValue}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex text-sm mt-3 justify-between items-center">
                          <p className="font-semibold text-gray-600">
                            Gamble responsibly 18+
                          </p>
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
                            <span>Additional Odds</span>
                            <BsChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <Star size={40} className="mx-auto" />
                  </div>
                  <p className="text-gray-600">
                    Select a match to view odds and predictions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
