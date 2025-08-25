import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  Calendar,
  MapPin,
  Trophy,
  ChevronDown,
  ChevronUp,
  Award,
  Loader2,
  Info,
  Star,
  RefreshCw,
  User,
} from "lucide-react";
import {
  FaFutbol,
  FaChessBoard as FaYellowCard,
  FaExchangeAlt,
  FaShieldAlt,
  FaTshirt,
} from "react-icons/fa";
import { GiCaptainHatProfile } from "react-icons/gi";
import { footballApiClient } from "../../utils/axios";

const Match = () => {
  const [fixture, setFixture] = useState(null);
  const [league, setLeague] = useState(null);
  const [teams, setTeams] = useState(null);
  const [goals, setGoals] = useState(null);
  const [score, setScore] = useState(null);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const response = await footballApiClient.get(`/v3/fixtures?id=${id}`);
        if (response.data.response.length === 0) {
          throw new Error("No match data found");
        }

        const data = response.data.response[0];

        // Set all states here
        setFixture(data.fixture);
        setLeague(data.league);
        setTeams(data.teams);
        setGoals(data.goals);
        setScore(data.score);
        setEvents(data.events || []);
        setStatistics(data.statistics || []);
        setPlayers(data.players || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching fixture details:", error);
        setError("Failed to load match data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  // Loading state display
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto text-blue-600 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading match details...
          </h2>
          <p className="text-gray-500 mt-2">Getting the latest information</p>
        </div>
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 mx-auto mb-4 rounded-full flex items-center justify-center">
            <Info size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Make sure we have essential data before rendering
  if (!fixture || !teams || !goals) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto text-blue-600 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading match data...
          </h2>
        </div>
      </div>
    );
  }

  // Format match date
  const matchDate = new Date(fixture.date);
  const formattedDate = matchDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Group events by type for easier rendering
  const groupedEvents = events.reduce((acc, event) => {
    const type = event.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(event);
    return acc;
  }, {});

  // Get team statistics
  const homeStats =
    statistics.find((stat) => stat?.team?.id === teams?.home?.id)?.statistics ||
    [];
  const awayStats =
    statistics.find((stat) => stat?.team?.id === teams?.away?.id)?.statistics ||
    [];

  // Get players by team
  const homePlayers =
    players.find((team) => team?.team?.id === teams?.home?.id)?.players || [];
  const awayPlayers =
    players.find((team) => team?.team?.id === teams?.away?.id)?.players || [];

  // Get starting lineup and substitutes
  const homeStarters =
    homePlayers.filter(
      (player) => player.statistics[0]?.games?.substitute === false
    ) || [];

  const homeSubstitutes =
    homePlayers.filter(
      (player) => player.statistics[0]?.games?.substitute === true
    ) || [];

  const awayStarters =
    awayPlayers.filter(
      (player) => player.statistics[0]?.games?.substitute === false
    ) || [];

  const awaySubstitutes =
    awayPlayers.filter(
      (player) => player.statistics[0]?.games?.substitute === true
    ) || [];

  // Utility function to determine match status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Match Finished":
        return "bg-gray-600";
      case "Live":
        return "bg-green-500";
      default:
        return "bg-blue-600";
    }
  };

  const renderEventIcon = (type) => {
    switch (type) {
      case "Goal":
        return <FaFutbol className="text-blue-600" />;
      case "Card":
        return <FaYellowCard className="text-yellow-500" />;
      case "subst":
        return <FaExchangeAlt className="text-green-600" />;
      case "Var":
        return <div className="text-xs font-bold text-purple-600">VAR</div>;
      default:
        return null;
    }
  };

  const renderStatBar = (homeStat, awayStat) => {
    if (homeStat === null || awayStat === null) return null;

    // Convert percentage strings to numbers if needed
    let homeValue =
      typeof homeStat === "string" && homeStat.includes("%")
        ? parseInt(homeStat)
        : homeStat === null
        ? 0
        : homeStat;

    let awayValue =
      typeof awayStat === "string" && awayStat.includes("%")
        ? parseInt(awayStat)
        : awayStat === null
        ? 0
        : awayStat;

    // Calculate percentage for bar widths
    const total = homeValue + awayValue;
    const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
    const awayPercent = total === 0 ? 50 : (awayValue / total) * 100;

    return (
      <div className="flex w-full h-2 my-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-l-full"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="h-full bg-gradient-to-l from-red-500 to-red-600 rounded-r-full"
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-gray-900 dark:to-gray-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy
                size={24}
                className="text-yellow-300 dark:text-yellow-400"
              />
              <span className="font-bold text-xl">
                {league?.name || "Match Details"}
              </span>
            </div>
            <span className="text-blue-100 dark:text-gray-300">
              {league?.round || "Match Day"}
            </span>
          </div>
        </div>
      </div>

      {/* Match Summary */}
      <div className="bg-white dark:bg-gray-900 shadow-lg relative">
        <div className="absolute left-0 right-0 -top-4 flex justify-center">
          <div
            className={`px-4 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(
              fixture?.status?.long
            )}`}
          >
            {fixture?.status?.long}
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Calendar
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formattedDate}
              </span>
              <Clock
                size={16}
                className="text-gray-500 ml-4 dark:text-gray-400"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formattedTime}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {fixture?.venue?.name}, {fixture?.venue?.city}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-center">
            <div className="lg:col-span-3 flex flex-col items-center lg:items-end">
              <div className="w-20 h-20 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <img
                  src={teams?.home?.logo}
                  alt={teams?.home?.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-center lg:text-right dark:text-white">
                {teams?.home?.name}
              </h2>
            </div>

            <div className="lg:col-span-1 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center mb-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <div className="text-4xl font-bold px-3 dark:text-white">
                  {goals?.home}
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-4xl font-light">
                  -
                </div>
                <div className="text-4xl font-bold px-3 dark:text-white">
                  {goals?.away}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Half-time: {score?.halftime?.home || 0} -{" "}
                {score?.halftime?.away || 0}
              </div>
              {score?.fulltime && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Full-time: {score?.fulltime?.home || 0} -{" "}
                  {score?.fulltime?.away || 0}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
              <div className="w-20 h-20 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <img
                  src={teams?.away?.logo}
                  alt={teams?.away?.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-center lg:text-left dark:text-white">
                {teams?.away?.name}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                <Info size={18} className="mr-2" />
                Match Info
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {/* Status */}
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Clock
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Status
                    </span>
                    <p className="font-medium dark:text-white">
                      {fixture?.status?.long || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Referee */}
                {fixture?.referee && (
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
                      <User
                        size={16}
                        className="text-yellow-600 dark:text-yellow-400"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Referee
                      </span>
                      <p className="font-medium dark:text-white">
                        {fixture.referee}
                      </p>
                    </div>
                  </div>
                )}

                {/* League */}
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                    <Trophy
                      size={16}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      League
                    </span>
                    <p className="font-medium dark:text-white">
                      {league?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Season */}
                {league?.season && (
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                      <Calendar
                        size={16}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Season
                      </span>
                      <p className="font-medium dark:text-white">
                        {league.season}
                      </p>
                    </div>
                  </div>
                )}

                {/* Round */}
                {league?.round && (
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                      <RefreshCw
                        size={16}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Round
                      </span>
                      <p className="font-medium dark:text-white">
                        {league.round}
                      </p>
                    </div>
                  </div>
                )}

                {/* Venue */}
                {fixture?.venue?.name && (
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                      <MapPin
                        size={16}
                        className="text-red-600 dark:text-red-400"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        Venue
                      </span>
                      <p className="font-medium dark:text-white">
                        {fixture.venue.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {homeStats?.length > 0 && awayStats?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                  <Star size={18} className="mr-2" />
                  Key Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium dark:text-white">
                        {homeStats.find((s) => s.type === "Ball Possession")
                          ?.value || "0%"}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Possession
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {awayStats.find((s) => s.type === "Ball Possession")
                          ?.value || "0%"}
                      </span>
                    </div>
                    {renderStatBar(
                      parseInt(
                        homeStats.find((s) => s.type === "Ball Possession")
                          ?.value || "0%"
                      ),
                      parseInt(
                        awayStats.find((s) => s.type === "Ball Possession")
                          ?.value || "0%"
                      )
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium dark:text-white">
                        {homeStats.find((s) => s.type === "Total Shots")
                          ?.value || 0}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Shots
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {awayStats.find((s) => s.type === "Total Shots")
                          ?.value || 0}
                      </span>
                    </div>
                    {renderStatBar(
                      homeStats.find((s) => s.type === "Total Shots")?.value ||
                        0,
                      awayStats.find((s) => s.type === "Total Shots")?.value ||
                        0
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium dark:text-white">
                        {homeStats.find((s) => s.type === "Shots on Goal")
                          ?.value || 0}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        On Target
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {awayStats.find((s) => s.type === "Shots on Goal")
                          ?.value || 0}
                      </span>
                    </div>
                    {renderStatBar(
                      homeStats.find((s) => s.type === "Shots on Goal")
                        ?.value || 0,
                      awayStats.find((s) => s.type === "Shots on Goal")
                        ?.value || 0
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium dark:text-white">
                        {homeStats.find((s) => s.type === "Corner Kicks")
                          ?.value || 0}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Corners
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {awayStats.find((s) => s.type === "Corner Kicks")
                          ?.value || 0}
                      </span>
                    </div>
                    {renderStatBar(
                      homeStats.find((s) => s.type === "Corner Kicks")?.value ||
                        0,
                      awayStats.find((s) => s.type === "Corner Kicks")?.value ||
                        0
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium dark:text-white">
                        {homeStats.find((s) => s.type === "Yellow Cards")
                          ?.value || 0}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Yellow Cards
                      </span>
                      <span className="text-sm font-medium dark:text-white">
                        {awayStats.find((s) => s.type === "Yellow Cards")
                          ?.value || 0}
                      </span>
                    </div>
                    {renderStatBar(
                      homeStats.find((s) => s.type === "Yellow Cards")?.value ||
                        0,
                      awayStats.find((s) => s.type === "Yellow Cards")?.value ||
                        0
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Main Content */}
          <div className="lg:col-span-6">
            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("events")}
                  className={`flex-1 py-3 px-2 text-center flex items-center justify-center ${
                    activeTab === "events"
                      ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <FaFutbol className="mr-2" size={16} />
                  Events
                </button>
                <button
                  onClick={() => setActiveTab("lineups")}
                  className={`flex-1 py-3 px-2 text-center flex items-center justify-center ${
                    activeTab === "lineups"
                      ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <FaTshirt className="mr-2" size={16} />
                  Lineups
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`flex-1 py-3 px-2 text-center flex items-center justify-center ${
                    activeTab === "stats"
                      ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Award className="mr-2" size={16} />
                  Statistics
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                    <FaFutbol className="mr-2" />
                    Match Events
                  </h3>

                  {events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-12 text-center font-medium">
                            {event.time?.elapsed || 0}'
                            {event.time?.extra && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{event.time.extra}
                              </span>
                            )}
                          </div>

                          <div className="mx-4 mt-1">
                            {renderEventIcon(event.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center">
                              {event.team?.logo && (
                                <img
                                  src={event.team.logo}
                                  alt={event.team?.name || "Team"}
                                  className="w-5 h-5 mr-2"
                                />
                              )}
                              <span className="text-sm font-medium">
                                {event.team?.name || "Unknown Team"}
                              </span>
                            </div>

                            <div className="mt-1">
                              <div className="text-sm font-medium">
                                {event.player?.name || "Unknown Player"}
                              </div>
                              {event.assist?.name && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Assist: {event.assist.name}
                                </div>
                              )}
                              {event.detail && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {event.detail}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <FaFutbol
                        size={40}
                        className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                      />
                      <p>No events recorded for this match yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Lineups Tab */}
              {activeTab === "lineups" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                    <FaTshirt className="mr-2" />
                    Starting XI
                  </h3>

                  {homeStarters.length > 0 && awayStarters.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Home Team Starting XI */}
                        <div>
                          <div className="flex items-center mb-3">
                            {teams?.home?.logo && (
                              <img
                                src={teams.home.logo}
                                alt={teams?.home?.name || "Home Team"}
                                className="w-6 h-6 mr-2"
                              />
                            )}
                            <h4 className="text-md font-medium text-blue-800 dark:text-blue-400">
                              {teams?.home?.name || "Home Team"}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {homeStarters.map((player) => (
                              <div
                                key={player.player?.id}
                                onClick={() =>
                                  navigate(
                                    "/football/player/" + player.player.id
                                  )
                                }
                                className="flex justify-between cursor-pointer items-center text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <img
                                      src={player.player?.photo}
                                      className="h-7 w-7 rounded-full"
                                      alt=""
                                    />
                                  </div>
                                  <span className="ml-2 flex gap-2 items-center">
                                    {player.player?.name || "Unknown Player"}
                                    {player.statistics[0]?.games?.captain && (
                                      <div className=" bg-yellow-400 rounded-full p-1">
                                        <GiCaptainHatProfile className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                  </span>
                                </div>
                                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                                  {player.statistics[0]?.games?.number || "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Away Team Starting XI */}
                        <div>
                          <div className="flex items-center mb-3">
                            {teams?.away?.logo && (
                              <img
                                src={teams.away.logo}
                                alt={teams?.away?.name || "Away Team"}
                                className="w-6 h-6 mr-2"
                              />
                            )}
                            <h4 className="text-md font-medium text-red-800 dark:text-red-400">
                              {teams?.away?.name || "Away Team"}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {awayStarters.map((player) => (
                              <div
                                onClick={() =>
                                  navigate(
                                    "/football/player/" + player.player.id
                                  )
                                }
                                key={player.player?.id}
                                className="flex items-center cursor-pointer justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={player.player?.photo}
                                    className="h-7 w-7 rounded-full"
                                    alt=""
                                  />
                                  <span className="ml-2 flex gap-2 items-center">
                                    {player.player?.name || "Unknown Player"}
                                    {player.statistics[0]?.games?.captain && (
                                      <div className=" bg-yellow-400 rounded-full p-1">
                                        <GiCaptainHatProfile className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                  </span>
                                </div>
                                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
                                  {player.statistics[0]?.games?.number || "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                        <FaExchangeAlt className="mr-2" />
                        Substitutes
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Home Team Substitutes */}
                        <div>
                          <div className="space-y-2">
                            {homeSubstitutes.length > 0 ? (
                              homeSubstitutes.map((player) => (
                                <div
                                  onClick={() =>
                                    navigate(
                                      "/football/player/" + player.player.id
                                    )
                                  }
                                  key={player.player?.id}
                                  className="flex items-center cursor-pointer justify-between text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors opacity-80"
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={player.player?.photo}
                                      className="h-7 w-7 rounded-full"
                                      alt=""
                                    />
                                    <span className="ml-2">
                                      {player.player?.name || "Unknown Player"}
                                    </span>
                                  </div>
                                  <span className="w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-xs">
                                    {player.statistics[0]?.games?.number || "-"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                No substitutes listed
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Away Team Substitutes */}
                        <div>
                          <div className="space-y-2">
                            {awaySubstitutes.length > 0 ? (
                              awaySubstitutes.map((player) => (
                                <div
                                  onClick={() =>
                                    navigate(
                                      "/football/player/" + player.player.id
                                    )
                                  }
                                  key={player.player?.id}
                                  className="flex justify-between cursor-pointer items-center text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded hover:bg-red-50 dark:hover:bg-gray-700 transition-colors opacity-80"
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={player.player?.photo}
                                      className="h-7 w-7 rounded-full"
                                      alt=""
                                    />
                                    <span className="ml-2">
                                      {player.player?.name || "Unknown Player"}
                                    </span>
                                  </div>
                                  <span className="w-6 h-6 bg-red-400 text-white rounded-full flex items-center justify-center text-xs">
                                    {player.statistics[0]?.games?.number || "-"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                                No substitutes listed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <FaTshirt
                        size={40}
                        className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                      />
                      <p>No lineup information available for this match</p>
                    </div>
                  )}
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                    <Award className="mr-2" />
                    Match Statistics
                  </h3>

                  {homeStats.length > 0 && awayStats.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img
                              src={teams?.home?.logo}
                              alt={teams?.home?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                            {teams?.home?.name}
                          </span>
                        </div>
                        <div className="mx-4 text-sm text-gray-500 dark:text-gray-400">
                          vs
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img
                              src={teams?.away?.logo}
                              alt={teams?.away?.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-sm font-medium text-red-800 dark:text-red-400">
                            {teams?.away?.name}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {homeStats
                          .slice(0, isStatsExpanded ? homeStats.length : 8)
                          .map((stat, index) => {
                            const awayStat = awayStats.find(
                              (s) => s.type === stat.type
                            );
                            if (!awayStat) return null;

                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
                                    {stat.value}
                                  </span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.type}
                                  </span>
                                  <span className="text-sm font-medium text-red-800 dark:text-red-400">
                                    {awayStat.value}
                                  </span>
                                </div>
                                {renderStatBar(stat.value, awayStat.value)}
                              </div>
                            );
                          })}
                      </div>

                      {homeStats.length > 8 && (
                        <div className="text-center pt-4">
                          <button
                            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {isStatsExpanded ? (
                              <>
                                <ChevronUp size={16} className="mr-1" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} className="mr-1" />
                                Show More Stats
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <Award
                        size={40}
                        className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                      />
                      <p>No statistics available for this match</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            {/* Team Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                <FaShieldAlt className="mr-2" />
                Team Form
              </h3>
              <div className="space-y-4">
                {/* Home Team Form */}
                <div>
                  <div className="flex items-center mb-2">
                    {teams?.home?.logo && (
                      <img
                        src={teams.home.logo}
                        alt={teams?.home?.name || "Home Team"}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    <h4 className="text-md font-medium dark:text-gray-200">
                      {teams?.home?.name || "Home Team"}
                    </h4>
                  </div>
                  <div className="flex space-x-1">
                    {["W", "L", "W", "D", "L"].map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                          result === "W"
                            ? "bg-green-500 text-white"
                            : result === "L"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-400 text-white"
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Away Team Form */}
                <div>
                  <div className="flex items-center mb-2">
                    {teams?.away?.logo && (
                      <img
                        src={teams.away.logo}
                        alt={teams?.away?.name || "Away Team"}
                        className="w-6 h-6 mr-2"
                      />
                    )}
                    <h4 className="text-md font-medium dark:text-gray-200">
                      {teams?.away?.name || "Away Team"}
                    </h4>
                  </div>
                  <div className="flex space-x-1">
                    {["L", "W", "W", "W", "D"].map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                          result === "W"
                            ? "bg-green-500 text-white"
                            : result === "L"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-400 text-white"
                        }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Head to Head */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center">
                <Trophy className="mr-2" size={18} />
                Head to Head
              </h3>
              <div className="space-y-3">
                {/* Example H2H Matches */}
                {[
                  {
                    date: "2024-04-21",
                    homeTeam: teams?.home?.name,
                    awayTeam: teams?.away?.name,
                    score: "1-2",
                  },
                  {
                    date: "2023-12-10",
                    homeTeam: teams?.away?.name,
                    awayTeam: teams?.home?.name,
                    score: "0-2",
                  },
                  {
                    date: "2023-03-05",
                    homeTeam: teams?.home?.name,
                    awayTeam: teams?.away?.name,
                    score: "3-1",
                  },
                  {
                    date: "2022-11-12",
                    homeTeam: teams?.away?.name,
                    awayTeam: teams?.home?.name,
                    score: "1-1",
                  },
                ].map((match, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {match.date}
                    </div>
                    <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
                      <span className="text-sm">{match.homeTeam}</span>
                      <span className="text-sm font-bold">{match.score}</span>
                      <span className="text-sm">{match.awayTeam}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Match;
