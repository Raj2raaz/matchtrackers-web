import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaMapMarkerAlt,
  FaPlay,
  FaTimes,
  FaRegClock,
  FaInfoCircle,
  FaUsers,
  FaArrowUp,
  FaCommentDots,
} from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import TrendingPlayers from "../components/TrendingPlayers";
import volleyballPoster from "../assets/volleyballPoster.png";
import TopNews from "../components/TopNews";
import { useNavigate, useParams } from "react-router-dom";
import { cricApiClient as apiClient, sofaScoreApi } from "../utils/axios";
import Image from "../components/Image";
import MatchVideosSection from "../components/MatchVideosSection";
import YtShorts from "../components/YtShorts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import findTournamentIdAndFetchOdds from "../utils/getOdds";
import toast from "react-hot-toast";

const AnalyticsMatch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [score, setScore] = useState(null);
  const [commentary, setCommentary] = useState(null);
  const [activeTab, setActiveTab] = useState("Info");
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const [sofaData, setSofaData] = useState({});
  const [showOdds, setShowOdds] = useState(2);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [matchResponse, scoreResponse, commResponse] = await Promise.all([
          apiClient.get(`/mcenter/v1/${id}`),
          apiClient.get(`/mcenter/v1/${id}/scard`),
          apiClient.get(`/mcenter/v1/${id}/comm`),
        ]);

        // Fetch odds data
        let sofaDataResponse = {};
        try {
          sofaDataResponse = await findTournamentIdAndFetchOdds(
            matchResponse.data.matchInfo.team1.shortName,
            matchResponse.data.matchInfo.team2.shortName,
            matchResponse.data.matchInfo.matchStartTimestamp,
            1
          );
        } catch (err) {
          console.log("Error fetching odds data:", err);
        }

        setSofaData(sofaDataResponse);
        setData(matchResponse.data);
        setScore(scoreResponse.data);
        setCommentary(commResponse.data);
      } catch (error) {
        console.log("Error fetching match data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const tabs = useMemo(
    () => [
      {
        id: "Info",
        icon: <FaInfoCircle className="mr-2" />,
        label: "Match Info",
      },
      {
        id: "Squads",
        icon: <FaUsers className="mr-2" />,
        label: "Squads",
      },
      {
        id: "Commentary",
        icon: <FaCommentDots className="mr-2" />,
        label: "Commentary",
      },
    ],
    []
  );

  // Memoized helpers to reduce recomputation
  const getBatters = useMemo(
    () => (scorecard) => {
      return scorecard?.batsman?.filter((batsman) => batsman.balls > 0) || [];
    },
    []
  );

  const getBowlers = useMemo(
    () => (scorecard) => {
      return scorecard?.bowler?.filter((bowler) => bowler.overs) || [];
    },
    []
  );

  // Get player role color
  const getRoleColor = (role) => {
    if (role?.includes("Batsman")) return "bg-blue-100 text-blue-800";
    if (role?.includes("Bowler")) return "bg-green-100 text-green-800";
    if (role?.includes("Allrounder")) return "bg-purple-100 text-purple-800";
    if (role?.includes("WK")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Render squads tab content
  const renderSquadsTab = () => {
    return (
      <div className="p-2 md:p-4">
        {data?.matchInfo?.team1 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Image
                faceImageId={data.matchInfo.team1.imageId}
                className="h-6 w-6"
              />
              <h3 className="font-bold text-lg">{data.matchInfo.team1.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {data.matchInfo.team1.playerDetails
                ?.filter(
                  (player) => !player.isSupportStaff && !player.substitute
                )
                .map((player) => (
                  <div
                    key={player.id}
                    onClick={() => navigate("/player/" + player.id)}
                    className="border cursor-pointer border-gray-200 rounded-lg p-2 md:p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        faceImageId={player?.faceImageId}
                        className="h-8 w-8 rounded-full object-cover"
                        alt={player.fullName}
                      />
                      <div className="font-medium truncate">
                        {player.fullName}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {player.captain && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                          Captain
                        </span>
                      )}
                      {player.keeper && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          Keeper
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex flex-wrap gap-1">
                      <span
                        className={`px-2 py-0.5 rounded ${getRoleColor(
                          player.role
                        )}`}
                      >
                        {player.role}
                      </span>
                      {player.isOverseas && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                          Overseas
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.battingStyle} Bat
                      </span>
                      {player.bowlingStyle && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                          {player.bowlingStyle}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {data?.matchInfo?.team2 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                faceImageId={data.matchInfo.team2.imageId}
                className="h-6 w-6"
                alt={data.matchInfo.team2.name}
              />
              <h3 className="font-bold text-lg">{data.matchInfo.team2.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {data.matchInfo.team2.playerDetails
                ?.filter(
                  (player) => !player.isSupportStaff && !player.substitute
                )
                .map((player) => (
                  <div
                    onClick={() => navigate("/player/" + player.id)}
                    key={`team2-${player.id}`}
                    className="border cursor-pointer border-gray-200 rounded-lg p-2 md:p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        faceImageId={player?.faceImageId}
                        className="h-8 w-8 rounded-full object-cover"
                        alt={player.fullName}
                      />
                      <div className="font-medium truncate">
                        {player.fullName}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {player.captain && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                          Captain
                        </span>
                      )}
                      {player.keeper && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          Keeper
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex flex-wrap gap-1">
                      <span
                        className={`px-2 py-0.5 rounded ${getRoleColor(
                          player.role
                        )}`}
                      >
                        {player.role}
                      </span>
                      {player.isOverseas && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                          Overseas
                        </span>
                      )}
                    </div>
                    <div className="text-xs flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.battingStyle} Bat
                      </span>
                      {player.bowlingStyle && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                          {player.bowlingStyle}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render info tab content
  const renderInfoTab = () => {
    return (
      <div className="divide-y divide-gray-200">
        {/* Batters Table */}
        <div className="p-2 md:p-4">
          <h3 className="font-bold text-base mb-3 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Batting Stats
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-200">
                  <th className="py-2 px-2 text-left">Batter</th>
                  <th className="py-2 px-2 text-center">R</th>
                  <th className="py-2 px-2 text-center">B</th>
                  <th className="py-2 px-2 text-center">4s</th>
                  <th className="py-2 px-2 text-center">6s</th>
                  <th className="py-2 px-2 text-center">SR</th>
                </tr>
              </thead>
              <tbody>
                {score?.scorecard?.length > 0 &&
                  getBatters(score?.scorecard[1]).map((batter, index) => (
                    <tr
                      key={index}
                      className="text-sm border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2 whitespace-nowrap">
                        {batter.name}
                      </td>
                      <td className="py-2 px-2 text-center font-medium">
                        {batter.runs}
                      </td>
                      <td className="py-2 px-2 text-center">{batter.balls}</td>
                      <td className="py-2 px-2 text-center">{batter.fours}</td>
                      <td className="py-2 px-2 text-center">
                        {batter.sixes || 0}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {batter.strkRate}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowlers Table */}
        <div className="p-2 md:p-4">
          <h3 className="font-bold text-base mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Bowling Stats
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-200">
                  <th className="py-2 px-2 text-left">Bowler</th>
                  <th className="py-2 px-2 text-center">O</th>
                  <th className="py-2 px-2 text-center">M</th>
                  <th className="py-2 px-2 text-center">R</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">ECO</th>
                </tr>
              </thead>
              <tbody>
                {score?.scorecard?.length > 0 &&
                  getBowlers(score?.scorecard[0]).map((bowler, index) => (
                    <tr
                      key={index}
                      className="text-sm border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2 whitespace-nowrap">
                        {bowler.name}
                      </td>
                      <td className="py-2 px-2 text-center">{bowler.overs}</td>
                      <td className="py-2 px-2 text-center">
                        {bowler.maidens || 0}
                      </td>
                      <td className="py-2 px-2 text-center">{bowler.runs}</td>
                      <td className="py-2 px-2 text-center font-medium">
                        {bowler.wickets}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {bowler.economy}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCommentaryTab = () => {
    return (
      <div className="p-2 md:p-4">
        <h2 className="text-lg font-semibold mb-4">Match Commentary</h2>
        <div className="h-64 md:h-96 overflow-y-auto">
          {commentary?.commentaryList?.map((e, i) => (
            <div
              className={`text-sm py-2 px-2 ${
                i !== 0 ? "border-t border-gray-100" : ""
              }`}
              key={i}
            >
              {e?.commText}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sample data for the graph (replace with actual data)
  const graphData = useMemo(
    () => [
      { name: "Over 1", runs: 5 },
      { name: "Over 2", runs: 12 },
      { name: "Over 3", runs: 8 },
      { name: "Over 4", runs: 15 },
      { name: "Over 5", runs: 7 },
      { name: "Over 6", runs: 10 },
      { name: "Over 7", runs: 6 },
      { name: "Over 8", runs: 14 },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 font-sans text-gray-800">
      {/* Match Header for Mobile */}
      {data?.matchInfo && (
        <div className="md:hidden bg-white rounded-lg shadow-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full truncate max-w-40">
              {commentary?.matchHeader?.seriesName}
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {data.matchInfo.shortStatus}
            </span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center max-w-32">
              <div>
                <div className="font-bold truncate">
                  {data.matchInfo.team1.name}
                </div>
                <div className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team1.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}(
                      {score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}(
                      {score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <span className="text-base md:text-xl px-1">vs</span>
            <div className="flex items-center max-w-32">
              <div className="text-right">
                <div className="font-bold truncate">
                  {data.matchInfo.team2.name}
                </div>
                <div className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team2.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}(
                      {score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}(
                      {score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-600 justify-center">
            <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {data?.matchInfo?.venue?.name}, {data?.matchInfo?.venue?.city}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main content area */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left sidebar - Scorecard */}
            <div className="w-full lg:w-1/3 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 md:p-4">
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg md:text-xl font-bold">
                      {commentary?.miniscore?.batTeam?.teamScore}/
                      {commentary?.miniscore?.batTeam?.teamWkts}
                    </h1>
                    <span className="text-xs md:text-sm bg-blue-900 px-2 py-1 rounded-full">
                      {commentary?.miniscore?.matchStatus}
                    </span>
                  </div>
                  <div className="text-xs mt-1 text-blue-100 flex items-center flex-wrap">
                    <FaRegClock className="mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {commentary?.miniscore?.batTeam?.teamName} need{" "}
                      {commentary?.miniscore?.target -
                        commentary?.miniscore?.batTeam?.teamScore}{" "}
                      runs from {commentary?.miniscore?.remBalls} balls
                    </span>
                  </div>
                </div>

                {/* Recent Balls - Visual timeline */}
                <div className="bg-gray-50 px-3 md:px-4 py-3">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500 mr-2 flex-shrink-0">
                      RECENT
                    </span>
                    <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-thin">
                      {commentary?.miniscore?.recentOvsStats
                        ?.trim()
                        .split(/\s+/)
                        .slice(-8)
                        .map((ball, index) => (
                          <div
                            key={index}
                            className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0
                                   ${
                                     ball === "6"
                                       ? "bg-blue-600 text-white"
                                       : ""
                                   }
                                   ${
                                     ball === "4"
                                       ? "bg-green-500 text-white"
                                       : ""
                                   }
                                   ${
                                     ball === "W"
                                       ? "bg-red-600 text-white font-bold"
                                       : ""
                                   }
                                   ${ball === "|" ? "border-none" : ""}
                                   ${
                                     !["6", "4", "W", "|"].includes(ball)
                                       ? "bg-gray-200"
                                       : ""
                                   }`}
                          >
                            {ball === "|" ? "•" : ball}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Active players section */}
                <div className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="w-full sm:w-1/2">
                      <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        BATTING
                      </h2>
                      {/* Striker */}
                      <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="font-semibold text-sm truncate">
                            {commentary?.miniscore?.batsmanStriker?.batName}
                          </span>
                        </div>
                        <div className="flex mt-1">
                          <span className="text-xl font-bold mr-2">
                            {commentary?.miniscore?.batsmanStriker?.batRuns}
                          </span>
                          <span className="text-xs text-gray-500 self-end mb-1">
                            ({commentary?.miniscore?.batsmanStriker?.batBalls})
                          </span>
                        </div>
                        <div className="flex text-xs text-gray-600 mt-1 space-x-2 flex-wrap">
                          <span>
                            4s:{" "}
                            {commentary?.miniscore?.batsmanStriker?.batFours}
                          </span>
                          <span>
                            6s:{" "}
                            {commentary?.miniscore?.batsmanStriker?.batSixes}
                          </span>
                          <span>
                            SR:{" "}
                            {
                              commentary?.miniscore?.batsmanStriker
                                ?.batStrikeRate
                            }
                          </span>
                        </div>
                      </div>
                      {/* Non-Striker */}
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm truncate">
                            {commentary?.miniscore?.batsmanNonStriker?.batName}
                          </span>
                        </div>
                        <div className="flex mt-1">
                          <span className="text-xl font-bold mr-2">
                            {commentary?.miniscore?.batsmanNonStriker?.batRuns}
                          </span>
                          <span className="text-xs text-gray-500 self-end mb-1">
                            (
                            {commentary?.miniscore?.batsmanNonStriker?.batBalls}
                            )
                          </span>
                        </div>
                        <div className="flex text-xs text-gray-600 mt-1 space-x-2 flex-wrap">
                          <span>
                            4s:{" "}
                            {commentary?.miniscore?.batsmanNonStriker?.batFours}
                          </span>
                          <span>
                            6s:{" "}
                            {commentary?.miniscore?.batsmanNonStriker?.batSixes}
                          </span>
                          <span>
                            SR:{" "}
                            {
                              commentary?.miniscore?.batsmanNonStriker
                                ?.batStrikeRate
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 sm:border-l sm:border-gray-200 sm:pl-3 md:pl-4">
                      <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        BOWLING
                      </h2>
                      {/* Current Bowler */}
                      <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="font-semibold text-sm truncate">
                            {commentary?.miniscore?.bowlerStriker?.bowlName}
                          </span>
                        </div>
                        <div className="flex mt-1 items-end">
                          <span className="text-lg font-bold mr-2">
                            {commentary?.miniscore?.bowlerStriker?.bowlWkts}
                          </span>
                          <span className="text-xs text-gray-500">
                            /{commentary?.miniscore?.bowlerStriker?.bowlRuns}
                          </span>
                        </div>
                        <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                          <span>
                            Ovs: {commentary?.miniscore?.bowlerStriker?.bowlOvs}
                          </span>
                          <span>
                            Econ:{" "}
                            {commentary?.miniscore?.bowlerStriker?.bowlEcon}
                          </span>
                        </div>
                      </div>
                      {/* Other Bowler */}
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm truncate">
                            {commentary?.miniscore?.bowlerNonStriker?.bowlName}
                          </span>
                        </div>
                        <div className="flex mt-1 items-end">
                          <span className="text-lg font-bold mr-2">
                            {commentary?.miniscore?.bowlerNonStriker?.bowlWkts}
                          </span>
                          <span className="text-xs text-gray-500">
                            /{commentary?.miniscore?.bowlerNonStriker?.bowlRuns}
                          </span>
                        </div>
                        <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                          <span>
                            Ovs:{" "}
                            {commentary?.miniscore?.bowlerNonStriker?.bowlOvs}
                          </span>
                          <span>
                            Econ:{" "}
                            {commentary?.miniscore?.bowlerNonStriker?.bowlEcon}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Innings Summary */}
                <div className="p-3 md:p-4 border-t border-gray-200">
                  <h2 className="text-xs uppercase text-gray-500 mb-2">
                    CRR: {commentary?.miniscore?.crr}
                  </h2>
                  <div className="mt-1 flex justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Required RR</span>
                      <div className="font-semibold">
                        {commentary?.miniscore?.rrr || "--"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Target</span>
                      <div className="font-semibold">
                        {commentary?.miniscore?.target || "--"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Partnership</span>
                      <div className="font-semibold">
                        {commentary?.miniscore?.partnership || "0(0)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Progress Bar */}
                <div className="px-3 md:px-4 pb-3 md:pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (commentary?.miniscore?.batTeam?.teamScore /
                            commentary?.miniscore?.target) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Overs: {commentary?.miniscore?.overs}/
                      {commentary?.miniscore?.maxOvers}
                    </span>
                    <span>
                      {commentary?.miniscore?.batTeam?.teamScore}/
                      {commentary?.miniscore?.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Overview Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div className="p-3 md:p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">Match Stats</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {commentary?.matchHeader?.matchDescription}
                    </span>
                  </div>
                </div>

                {/* Chart section */}
                <div className="pr-3 py-3 md:py-4 md:pr-4">
                  <h3 className="text-sm pl-4 font-medium mb-3">
                    Run Rate Chart
                  </h3>
                  <div className="h-48 md:h-64" ref={chartRef}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={graphData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="runs"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Match betting odds */}
                {/* <div className="p-3 md:p-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-3">Match Odds</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm">
                      <div className="text-gray-500 text-xs mb-1">
                        {data?.matchInfo?.team1?.name}
                      </div>
                      <div className="font-semibold text-blue-600">1.73</div>
                    </div>
                    <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm">
                      <div className="text-gray-500 text-xs mb-1">
                        {data?.matchInfo?.team2?.name}
                      </div>
                      <div className="font-semibold text-blue-600">2.10</div>
                    </div>
                    <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm">
                      <div className="text-gray-500 text-xs mb-1">Draw</div>
                      <div className="font-semibold text-blue-600">11.0</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Odds provided for informational purposes only
                  </div>
                </div> */}
              </div>
            </div>

            {/* Center - Main match analytics */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2">
              {/* Match Header for Desktop */}
              {data?.matchInfo && (
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-blue-900 text-white rounded-full">
                        {commentary?.matchHeader?.seriesName}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full">
                        {data.matchInfo.shortStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-bold text-lg md:text-xl">
                            {data.matchInfo.team1.name}
                          </div>
                          <div className="text-sm md:text-base">
                            {score?.scorecard?.[0]?.batTeamName ===
                            data?.matchInfo?.team1.name ? (
                              <span>
                                {score?.scorecard[0].score}/
                                {score?.scorecard[0].wickets}(
                                {score?.scorecard[0].overs})
                              </span>
                            ) : score?.scorecard?.[1] ? (
                              <span>
                                {score?.scorecard[1].score}/
                                {score?.scorecard[1].wickets}(
                                {score?.scorecard[1].overs})
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <span className="text-xl md:text-2xl px-6">vs</span>
                      <div className="flex items-center">
                        <div className="text-right">
                          <div className="font-bold text-lg md:text-xl">
                            {data.matchInfo.team2.name}
                          </div>
                          <div className="text-sm md:text-base">
                            {score?.scorecard?.[0]?.batTeamName ===
                            data?.matchInfo?.team2.name ? (
                              <span>
                                {score?.scorecard[0].score}/
                                {score?.scorecard[0].wickets}(
                                {score?.scorecard[0].overs})
                              </span>
                            ) : score?.scorecard?.[1] ? (
                              <span>
                                {score?.scorecard[1].score}/
                                {score?.scorecard[1].wickets}(
                                {score?.scorecard[1].overs})
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-blue-100 mt-4 justify-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>
                        {data?.matchInfo?.venue?.name},{" "}
                        {data?.matchInfo?.venue?.city}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-thin border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 py-3 text-sm md:text-base whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "Info" && renderInfoTab()}
                  {activeTab === "Squads" && renderSquadsTab()}
                  {activeTab === "Commentary" && renderCommentaryTab()}
                </div>
              </div>

              {/* Match Videos Section */}
              <div className="mt-4">
                <MatchVideosSection commentary={commentary} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="hidden  lg:block  order-1 lg:order-3">
            <div className="bg-white  rounded-xl shadow-lg overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                <h2 className="text-xl font-bold">Match Odds</h2>
              </div>

              <div className="space-y-4 p-4">
                {sofaData?.odds?.markets?.slice(0, showOdds).map((market) => (
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
                <div className="w-full flex justify-center">
                  <button
                    onClick={() => {
                      if (showOdds === 2)
                        setShowOdds(sofaData?.odds?.market?.length);
                      else setShowOdds(2);
                    }}
                    className="cursor-pointer font-semibold"
                  >
                    {showOdds === sofaData?.odds?.market?.length
                      ? "Show Less"
                      : "Show More"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMatch;
