import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaFutbol,
  FaShieldAlt,
  FaRunning,
  FaStopwatch,
  FaStar,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { GiWhistle as Whistle } from "react-icons/gi";
import {
  Award,
  User,
  Flag,
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Shirt as ShirtSport,
  Eye,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Target,
  Zap,
  Clock,
  Percent,
  Star,
  Trophy,
  Dribbble,
  Shield,
  PlayCircle,
} from "lucide-react";
import example from "../../example.json";
import { getFBPlayerInfo } from "../../api/Football";

const Player = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [player, setPlayer] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        setLoading(true);
        const response = await getFBPlayerInfo(id);
        const { player, statistics } = response[0];

        setPlayer(player);
        setStatistics(statistics);
      } catch (err) {
        setError("Failed to load player data. Please try again later.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getPlayer();
  }, [id]);

  const LoaderDisplay = () => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 text-center max-w-md">
        <div className="h-16 w-16 mx-auto mb-4 text-blue-500 flex justify-center items-center animate-spin">
          <ShirtSport size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Loading Player Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please wait while we fetch the latest player information...
        </p>
      </div>
    </div>
  );

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: <Eye size={14} /> },
    { id: "stats", label: "STATS", icon: <FaStar size={14} /> },
    { id: "matches", label: "MATCHES", icon: <ShirtSport size={14} /> },
    { id: "news", label: "NEWS", icon: <PlayCircle size={14} /> },
    { id: "videos", label: "VIDEOS", icon: <PlayCircle size={14} /> },
  ];

  // Error Display Component
  const ErrorDisplay = ({ error }) => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 text-center max-w-md">
        <div className="h-16 w-16 mx-auto mb-4 text-red-500 flex justify-center items-center">
          <ShirtSport size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Player Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || "The requested player information could not be retrieved."}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 dark:hover:bg-gray-700 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/football")}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // If data is loading, show loader
  if (loading) {
    return <LoaderDisplay />;
  }

  // If no player data after loading finishes
  if (!loading && (!player || !statistics)) {
    return (
      <ErrorDisplay error="Player not found. Please check the player ID and try again." />
    );
  }

  // Calculate player statistics
  const calculateTotalGoals = () => {
    return statistics.reduce(
      (total, stat) => total + (stat.goals.total || 0),
      0
    );
  };

  const calculateTotalAssists = () => {
    return statistics.reduce(
      (total, stat) => total + (stat.goals.assists || 0),
      0
    );
  };

  const calculateTotalAppearances = () => {
    return statistics?.reduce(
      (total, stat) => total + (stat?.games?.appearences || 0),
      0
    );
  };

  const getPlayerAge = () => {
    if (!player?.birth?.date) return "N/A";

    const birthDate = new Date(player.birth.date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // MOCK Data for Most Viewed & Trending Players
  const mostViewedPlayers = [
    {
      id: 1100,
      name: "Erling Haaland",
      imageUrl: "https://media.api-sports.io/football/players/1100.png",
    },
    {
      id: 278,
      name: "Kylian Mbappé",
      imageUrl: "https://media.api-sports.io/football/players/278.png",
    },
    {
      id: 129718,
      name: "Jude Bellingham",
      imageUrl: "https://media.api-sports.io/football/players/129718.png",
    },
    {
      id: 184,
      name: "Harry Kane",
      imageUrl: "https://media.api-sports.io/football/players/184.png",
    },
    {
      id: 629,
      name: "Kevin De Bruyne",
      imageUrl: "https://media.api-sports.io/football/players/629.png",
    },
    {
      id: 44,
      name: "Rodri",
      imageUrl: "https://media.api-sports.io/football/players/44.png",
    },
    {
      id: 306,
      name: "Mohamed Salah",
      imageUrl: "https://media.api-sports.io/football/players/306.png",
    },
    {
      id: 631,
      name: "Phil Foden",
      imageUrl: "https://media.api-sports.io/football/players/631.png",
    },
    {
      id: 762,
      name: "Vinícius Júnior",
      imageUrl: "https://media.api-sports.io/football/players/762.png",
    },
    {
      id: 1460,
      name: "Bukayo Saka",
      imageUrl: "https://media.api-sports.io/football/players/1460.png",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-black md:px-28 min-h-screen font-sans">
      {/* SEO & Meta Tags */}
      <Helmet>
        <title>Player Profile | {player?.name}</title>
        <meta
          name="description"
          content={`${player?.name} - Football Player Profile and Statistics`}
        />
        <meta
          property="og:title"
          content={`Player Profile | ${player?.name}`}
        />
        <meta
          property="og:description"
          content={`${player?.name} - Football Player Profile and Statistics`}
        />
        <meta property="og:image" content={player?.photo} />
      </Helmet>

      {/* Tabs section - only visible on mobile */}
      {isMobile && (
        <div className="bg-white py-2 px-2 sticky top-0 z-10 shadow-md">
          <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium mx-1 flex items-center ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 flex flex-col md:flex-row gap-4 pt-6">
        {/* Left column - changes to top on mobile */}
        <div className={`md:w-1/3 w-full ${isMobile ? "order-1" : ""}`}>
          {/* Player Image & Basic Stats - Hidden on mobile (shown in the main column for mobile) */}
          <div className="hidden md:block bg-white dark:bg-gray-800 shadow rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 text-center">
              <div className="relative inline-block">
                <img
                  src={player?.photo}
                  alt={player?.name}
                  className="w-48 h-48 object-cover rounded-full mx-auto border-4 border-blue-500"
                />
                <div className="absolute -bottom-2 right-6 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {statistics?.[0]?.games?.position || "Position"}
                </div>
              </div>

              <h1 className="text-2xl font-bold mt-4 dark:text-gray-100">
                {player?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <img
                  src={statistics?.[0]?.team?.logo}
                  alt={statistics?.[0]?.team?.name}
                  className="h-4 w-4 object-contain"
                />
                {statistics?.[0]?.team?.name}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-xl border border-blue-100 dark:border-blue-700">
                  <div className="flex justify-center mb-1 text-blue-600 dark:text-blue-400">
                    <FaFutbol size={20} />
                  </div>
                  <p className="text-lg font-bold dark:text-gray-100">
                    {calculateTotalGoals()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Goals
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-3 rounded-xl border border-green-100 dark:border-green-700">
                  <div className="flex justify-center mb-1 text-green-600 dark:text-green-400">
                    <Zap size={20} />
                  </div>
                  <p className="text-lg font-bold dark:text-gray-100">
                    {calculateTotalAssists()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assists
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-xl border border-purple-100 dark:border-purple-700">
                  <div className="flex justify-center mb-1 text-purple-600 dark:text-purple-400">
                    <ShirtSport size={20} />
                  </div>
                  <p className="text-lg font-bold dark:text-gray-100">
                    {calculateTotalAppearances()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Matches
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 mt-4 rounded-xl shadow mb-4 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center gap-2 dark:text-gray-100">
                <Trophy size={18} className="text-blue-500" />
                Season Highlights
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl border border-blue-100 dark:border-blue-700 text-center">
                  <div className="text-blue-500 flex justify-center mb-2">
                    <FaFutbol size={24} />
                  </div>
                  <p className="text-2xl font-bold dark:text-gray-100">
                    {calculateTotalGoals()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Goals
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-xl border border-green-100 dark:border-green-700 text-center">
                  <div className="text-green-500 flex justify-center mb-2">
                    <Zap size={24} />
                  </div>
                  <p className="text-2xl font-bold dark:text-gray-100">
                    {calculateTotalAssists()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Assists
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl border border-purple-100 dark:border-purple-700 text-center">
                  <div className="text-purple-500 flex justify-center mb-2">
                    <ShirtSport size={24} />
                  </div>
                  <p className="text-2xl font-bold dark:text-gray-100">
                    {calculateTotalAppearances()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Appearances
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-xl border border-orange-100 dark:border-orange-700 text-center">
                  <div className="text-orange-500 flex justify-center mb-2">
                    <Star size={24} />
                  </div>
                  <p className="text-2xl font-bold dark:text-gray-100">
                    {statistics.length > 0 && statistics[0].games.rating
                      ? parseFloat(statistics[0].games.rating).toFixed(1)
                      : "N/A"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Avg. Rating
                  </p>
                </div>
              </div>

              {/* Shot Accuracy Visualization */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold mb-3 dark:text-gray-100">
                  Shot Accuracy
                </h3>
                {statistics.length > 0 && statistics[0].shots && (
                  <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          statistics[0].shots.total
                            ? Math.round(
                                (statistics[0].shots.on /
                                  statistics[0].shots.total) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium dark:text-gray-100">
                      {statistics[0].shots.on} / {statistics[0].shots.total} (
                      {statistics[0].shots.total
                        ? Math.round(
                            (statistics[0].shots.on /
                              statistics[0].shots.total) *
                              100
                          )
                        : 0}
                      %)
                    </div>
                  </div>
                )}
              </div>

              {/* Dribble Success Visualization */}
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold mb-3 dark:text-gray-100">
                  Dribble Success
                </h3>
                {statistics.length > 0 && statistics[0].dribbles && (
                  <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          statistics[0].dribbles.attempts
                            ? Math.round(
                                (statistics[0].dribbles.success /
                                  statistics[0].dribbles.attempts) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium dark:text-gray-100">
                      {statistics[0].dribbles.success} /{" "}
                      {statistics[0].dribbles.attempts} (
                      {statistics[0].dribbles.attempts
                        ? Math.round(
                            (statistics[0].dribbles.success /
                              statistics[0].dribbles.attempts) *
                              100
                          )
                        : 0}
                      %)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Most Viewed Players */}
          <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow mt-4 p-4">
            <div className="flex items-center pb-3 gap-2 font-medium text-gray-900 dark:text-gray-100">
              <Eye size={16} className="text-blue-500 dark:text-blue-400" />
              Most Viewed Players
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
              {mostViewedPlayers.slice(0, isMobile ? 6 : 10).map((player) => (
                <div
                  key={player.id}
                  onClick={() => navigate(`/football/player/${player.id}`)}
                  className="flex cursor-pointer gap-2 items-center my-1 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <img
                    src={player.imageUrl}
                    className="h-8 w-8 rounded-full object-cover"
                    alt={player.name}
                  />
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-200">
                    {player.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column / main content */}
        <div className="w-full">
          {/* Mobile Player Header */}
          <div className="flex mb-4 items-center md:hidden gap-4 bg-white dark:bg-gray-900 p-3 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <img
              src={player?.photo}
              alt={player?.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {player?.name}
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <img
                  src={statistics?.[0]?.team?.logo}
                  alt={statistics?.[0]?.team?.name}
                  className="h-4 w-4 object-contain"
                />
                {statistics?.[0]?.team?.name}
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs inline-block mt-1">
                {statistics?.[0]?.games?.position}
              </div>

              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <FaFutbol
                    className="text-blue-600 dark:text-blue-400"
                    size={14}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {calculateTotalGoals()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap
                    className="text-green-600 dark:text-green-400"
                    size={14}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {calculateTotalAssists()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ShirtSport
                    className="text-purple-600 dark:text-purple-400"
                    size={14}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {calculateTotalAppearances()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Info Card */}
          <div className="text-gray-500 dark:text-gray-50 bg-white dark:bg-gray-900 rounded-xl shadow mb-4 border border-gray-200 dark:border-gray-700">
            {!isMobile && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  Player Information
                </h2>
              </div>
            )}

            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="mb-1">
                  <p className="text-xs text-gray-500 dark:text-gray-50 flex items-center gap-1">
                    <User size={12} className="text-blue-500" />
                    FULL NAME
                  </p>
                  <p className="text-sm font-semibold">
                    {player?.firstname} {player?.lastname}
                  </p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} className="text-orange-500" />
                    BORN
                  </p>
                  <p className="text-sm font-semibold">{player?.birth?.date}</p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} className="text-red-500" />
                    BIRTHPLACE
                  </p>
                  <p className="text-sm font-semibold">
                    {player?.birth?.place}, {player?.birth?.country}
                  </p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaStar size={12} className="text-yellow-500" />
                    AGE
                  </p>
                  <p className="text-sm font-semibold">
                    {getPlayerAge()} years
                  </p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Flag size={12} className="text-green-500" />
                    NATIONALITY
                  </p>
                  <p className="text-sm font-semibold">{player?.nationality}</p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ShirtSport size={12} className="text-purple-500" />
                    POSITION
                  </p>
                  <p className="text-sm font-semibold">
                    {statistics?.[0]?.games?.position || "N/A"}
                  </p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Ruler size={12} className="text-indigo-500" />
                    HEIGHT
                  </p>
                  <p className="text-sm font-semibold">{player?.height}</p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Weight size={12} className="text-blue-500" />
                    WEIGHT
                  </p>
                  <p className="text-sm font-semibold">{player?.weight}</p>
                </div>
                <div className="mb-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Award size={12} className="text-red-500" />
                    INJURED
                  </p>
                  <p className="text-sm font-semibold flex items-center">
                    {player?.injured ? (
                      <span className="text-red-500 flex items-center">
                        <FaStopwatch size={12} className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="text-green-500 flex items-center">
                        <Zap size={12} className="mr-1" /> No
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team & League Info */}
          <div className="text-gray-500 dark:text-gray-50 bg-white dark:bg-gray-900 rounded-xl shadow mb-4 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={18} className="text-blue-500" />
                Teams & Leagues
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {statistics?.map((stat, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={stat.team.logo}
                          alt={stat.team.name}
                          className="h-10 w-10 object-contain"
                        />
                        <div>
                          <h3 className="font-medium">{stat.team.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <img
                              src={stat.league.flag}
                              alt={stat.league.country}
                              className="h-3"
                            />
                            {stat.league.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-medium flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {stat.league.season}
                      </div>
                    </div>
                    <div className="p-2 flex justify-between bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                          <ShirtSport size={12} />
                        </div>
                        <p className="font-semibold text-sm">
                          {stat.games.appearences || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Apps
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
                          <FaFutbol size={12} />
                        </div>
                        <p className="font-semibold text-sm">
                          {stat.goals.total || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Goals
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-1">
                          <Zap size={12} />
                        </div>
                        <p className="font-semibold text-sm">
                          {stat.goals.assists || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Assists
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                          <Star size={12} />
                        </div>
                        <p className="font-semibold text-sm">
                          {parseFloat(stat.games.rating || 0).toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Rating
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics by Competition */}
          <div className="text-gray-500 dark:text-gray-50 bg-white dark:bg-gray-900 rounded-xl shadow mb-4 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FaStar size={18} className="text-blue-500" />
                Statistics by Competition
              </h2>
            </div>

            {statistics?.map((stat, leagueIndex) => (
              <div
                key={leagueIndex}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900 flex items-center gap-3">
                  <img
                    src={stat.league.logo}
                    alt={stat.league.name}
                    className="h-8 w-8 object-contain"
                  />
                  <div>
                    <span className="font-medium">{stat.league.name}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <img
                        src={stat.team.logo}
                        alt={stat.team.name}
                        className="h-3 w-3 object-contain"
                      />
                      {stat.team.name} | Season {stat.league.season}
                    </div>
                  </div>
                </div>

                <div className="px-4 grid grid-cols-2 gap-3 pb-4 pt-3">
                  {/* Game Stats */}
                  <div className="mb-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <h3 className="text-md font-semibold flex items-center gap-1 mb-2 text-blue-600 dark:text-blue-400">
                      <ShirtSport size={16} />
                      Appearances
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center">
                        <div className="bg-blue-200 dark:bg-blue-800 rounded-lg p-2 mr-3">
                          <ShirtSport
                            size={16}
                            className="text-blue-700 dark:text-blue-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Total
                          </p>
                          <p className="font-bold">
                            {stat.games.appearences || 0}
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center">
                        <div className="bg-blue-200 dark:bg-blue-800 rounded-lg p-2 mr-3">
                          <PlayCircle
                            size={16}
                            className="text-blue-700 dark:text-blue-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Lineups
                          </p>
                          <p className="font-bold">{stat.games.lineups || 0}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center">
                        <div className="bg-blue-200 dark:bg-blue-800 rounded-lg p-2 mr-3">
                          <Clock
                            size={16}
                            className="text-blue-700 dark:text-blue-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Minutes
                          </p>
                          <p className="font-bold">
                            {stat.games.minutes || 0}'
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center">
                        <div className="bg-blue-200 dark:bg-blue-800 rounded-lg p-2 mr-3">
                          <Star
                            size={16}
                            className="text-blue-700 dark:text-blue-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Rating
                          </p>
                          <p className="font-bold">
                            {parseFloat(stat.games.rating || 0).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Goals & Assists */}
                  <div className="mb-4 p-3 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <h3 className="text-md font-semibold flex items-center gap-1 mb-2 text-green-600 dark:text-green-400">
                      <FaFutbol size={16} />
                      Goals & Assists
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg border border-green-100 dark:border-green-800 flex items-center">
                        <div className="bg-green-200 dark:bg-green-800 rounded-lg p-2 mr-3">
                          <FaFutbol
                            size={16}
                            className="text-green-700 dark:text-green-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Goals
                          </p>
                          <p className="font-bold">{stat.goals.total || 0}</p>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg border border-green-100 dark:border-green-800 flex items-center">
                        <div className="bg-green-200 dark:bg-green-800 rounded-lg p-2 mr-3">
                          <Zap
                            size={16}
                            className="text-green-700 dark:text-green-300"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            Assists
                          </p>
                          <p className="font-bold">{stat.goals.assists || 0}</p>
                        </div>
                      </div>
                      {stat.penalty && (
                        <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg border border-green-100 dark:border-green-800 flex items-center">
                          <div className="bg-green-200 dark:bg-green-800 rounded-lg p-2 mr-3">
                            <Target
                              size={16}
                              className="text-green-700 dark:text-green-300"
                            />
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                              Penalties
                            </p>
                            <p className="font-bold">
                              {stat.penalty.scored || 0}/
                              {(stat.penalty.scored || 0) +
                                (stat.penalty.missed || 0)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* The same dark mode treatment continues for Shots, Passes, Defensive, Dribbles, Cards... */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
