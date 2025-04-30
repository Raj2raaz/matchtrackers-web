import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FaMapMarkerAlt,
  FaPlay,
  FaTimes,
  FaRegClock,
  FaInfoCircle,
  FaUsers,
  FaArrowUp,
  FaCommentDots,
} from "react-icons/fa";

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
import Sqads from "../components/AnalyticsMatch/Sqads";
import ScoreCard from "../components/AnalyticsMatch/ScoreCard";
import MatchOdds from "../components/AnalyticsMatch/MatchOdds";
import Overs from "../components/AnalyticsMatch/Overs";
import TrendingPlayers from "../components/TrendingPlayers";
import EditorPicks from "../components/EditorPicks";
import PointTable from "../components/PointTable";
import MatchCountdown from "../components/StartCountDown";
import LastBallResult from "../components/FlashyLastBall";
import TeamComparisonCard from "../components/AnalyticsMatch/TeamComparision";
import VenueStats from "../components/AnalyticsMatch/VenueStats";

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
  const [overData, setOverData] = useState([]);
  const [pTable, setPtable] = useState({});
  const [venuStats, setVenueStats] = useState();

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
    const getData = async () => {
      try {
        const response = await apiClient.get(
          `/stats/v1/series/${
            data?.matchInfo?.series?.id || "7572"
          }/points-table`
        );

        setPtable(response.data);

        const venueResponse = await apiClient.get(
          `/stats/v1/venue/${data?.matchInfo?.venue?.id}`
        );
        setVenueStats(venueResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (data?.matchInfo) {
      getData();
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [matchResponse, scoreResponse, commResponse, overResponse] =
          await Promise.all([
            apiClient.get(`/mcenter/v1/${id}`),
            apiClient.get(`/mcenter/v1/${id}/scard`),
            apiClient.get(`/mcenter/v1/${id}/comm`),
            apiClient.get(`/mcenter/v1/${id}/overs`),
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
        setOverData(overResponse.data.overSummaryList);
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
        label: "Score Card",
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
      <div className="flex justify-center items-center h-screen">
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
                      {commentary?.miniscore?.batTeam?.teamScore || 0}/
                      {commentary?.miniscore?.batTeam?.teamWkts || 0}
                    </h1>

                    {commentary?.miniscore?.recentOvsStats ? (
                      <LastBallResult
                        recentOvsStats={commentary.miniscore.recentOvsStats}
                      />
                    ) : (
                      <span className="text-xs md:text-sm bg-blue-900 px-2 py-1 rounded-full">
                        Not Started
                      </span>
                    )}
                  </div>
                  {commentary?.miniscore?.target ? (
                    <div className="text-xs mt-1 text-blue-100 flex items-center flex-wrap">
                      <FaRegClock className="mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {commentary?.miniscore?.batTeam?.teamName || "Team"}{" "}
                        need{" "}
                        {(commentary?.miniscore?.target || 0) -
                          (commentary?.miniscore?.batTeam?.teamScore || 0)}{" "}
                        runs from {commentary?.miniscore?.remBalls || 0} balls
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs mt-1 text-blue-100">
                      {commentary?.miniscore?.matchStatus ===
                      "Match not started"
                        ? "Match yet to begin"
                        : `${
                            commentary?.miniscore?.batTeam?.teamName || "Team"
                          } batting`}
                    </div>
                  )}
                </div>

                {/* Recent Balls - Visual timeline */}
                <div className="bg-gray-50 px-3 md:px-4 py-3">
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500 mr-2 flex-shrink-0">
                      RECENT
                    </span>
                    <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-thin">
                      {commentary?.miniscore?.recentOvsStats
                        ? commentary.miniscore.recentOvsStats
                            .trim()
                            .split(/\s+/)
                            .slice(-8)
                            .map((ball, index) => (
                              <div
                                key={index}
                                className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0
                           ${ball === "6" ? "bg-blue-600 text-white" : ""}
                           ${ball === "4" ? "bg-green-500 text-white" : ""}
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
                            ))
                        : Array(8)
                            .fill("0")
                            .map((_, index) => (
                              <div
                                key={index}
                                className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0 bg-gray-200"
                              >
                                -
                              </div>
                            ))}
                    </div>
                  </div>
                </div>

                {/* Active players section */}
                <div className="p-3 md:p-4">
                  {commentary?.miniscore?.batsmanStriker ? (
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
                              {commentary?.miniscore?.batsmanStriker?.batName ||
                                "Batsman"}
                            </span>
                          </div>
                          <div className="flex mt-1">
                            <span className="text-xl font-bold mr-2">
                              {commentary?.miniscore?.batsmanStriker?.batRuns ||
                                0}
                            </span>
                            <span className="text-xs text-gray-500 self-end mb-1">
                              (
                              {commentary?.miniscore?.batsmanStriker
                                ?.batBalls || 0}
                              )
                            </span>
                          </div>
                          <div className="flex text-xs text-gray-600 mt-1 space-x-2 flex-wrap">
                            <span>
                              4s:{" "}
                              {commentary?.miniscore?.batsmanStriker
                                ?.batFours || 0}
                            </span>
                            <span>
                              6s:{" "}
                              {commentary?.miniscore?.batsmanStriker
                                ?.batSixes || 0}
                            </span>
                            <span>
                              SR:{" "}
                              {commentary?.miniscore?.batsmanStriker
                                ?.batStrikeRate || "0.00"}
                            </span>
                          </div>
                        </div>
                        {/* Non-Striker */}
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-sm truncate">
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batName || "Batsman"}
                            </span>
                          </div>
                          <div className="flex mt-1">
                            <span className="text-xl font-bold mr-2">
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batRuns || 0}
                            </span>
                            <span className="text-xs text-gray-500 self-end mb-1">
                              (
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batBalls || 0}
                              )
                            </span>
                          </div>
                          <div className="flex text-xs text-gray-600 mt-1 space-x-2 flex-wrap">
                            <span>
                              4s:{" "}
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batFours || 0}
                            </span>
                            <span>
                              6s:{" "}
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batSixes || 0}
                            </span>
                            <span>
                              SR:{" "}
                              {commentary?.miniscore?.batsmanNonStriker
                                ?.batStrikeRate || "0.00"}
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
                              {commentary?.miniscore?.bowlerStriker?.bowlName ||
                                "Bowler"}
                            </span>
                          </div>
                          <div className="flex mt-1 items-end">
                            <span className="text-lg font-bold mr-2">
                              {commentary?.miniscore?.bowlerStriker?.bowlWkts ||
                                0}
                            </span>
                            <span className="text-xs text-gray-500">
                              /
                              {commentary?.miniscore?.bowlerStriker?.bowlRuns ||
                                0}
                            </span>
                          </div>
                          <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                            <span>
                              Ovs:{" "}
                              {commentary?.miniscore?.bowlerStriker?.bowlOvs ||
                                "0.0"}
                            </span>
                            <span>
                              Econ:{" "}
                              {commentary?.miniscore?.bowlerStriker?.bowlEcon ||
                                "0.00"}
                            </span>
                          </div>
                        </div>
                        {/* Other Bowler */}
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-sm truncate">
                              {commentary?.miniscore?.bowlerNonStriker
                                ?.bowlName || "Bowler"}
                            </span>
                          </div>
                          <div className="flex mt-1 items-end">
                            <span className="text-lg font-bold mr-2">
                              {commentary?.miniscore?.bowlerNonStriker
                                ?.bowlWkts || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              /
                              {commentary?.miniscore?.bowlerNonStriker
                                ?.bowlRuns || 0}
                            </span>
                          </div>
                          <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                            <span>
                              Ovs:{" "}
                              {commentary?.miniscore?.bowlerNonStriker
                                ?.bowlOvs || "0.0"}
                            </span>
                            <span>
                              Econ:{" "}
                              {commentary?.miniscore?.bowlerNonStriker
                                ?.bowlEcon || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Match data not available or match hasn't started
                    </div>
                  )}
                </div>

                {/* Innings Summary */}
                <div className="p-3 md:p-4 border-t border-gray-200">
                  <h2 className="text-xs uppercase text-gray-500 mb-2">
                    CRR: {commentary?.miniscore?.crr || "0.00"}
                  </h2>
                  <div className="mt-1 flex justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Required RR</span>
                      <div className="font-semibold">
                        {commentary?.miniscore?.rrr || "0.00"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Target</span>
                      <div className="font-semibold">
                        {commentary?.miniscore?.target || "N/A"}
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
                          commentary?.miniscore?.target &&
                          commentary?.miniscore?.batTeam?.teamScore
                            ? Math.min(
                                (commentary.miniscore.batTeam.teamScore /
                                  commentary.miniscore.target) *
                                  100,
                                100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Overs: {commentary?.miniscore?.overs || "0.0"}/
                      {commentary?.miniscore?.maxOvers || "0.0"}
                    </span>
                    <span>
                      {commentary?.miniscore?.batTeam?.teamScore || 0}/
                      {commentary?.miniscore?.target || "?"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Overview Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                <div className=" border-b border-gray-200">
                  <div className="flex bg-gradient-to-r py-5 px-4 text-white from-blue-600 to-blue-800 items-center justify-between">
                    <h2 className="font-bold">Match Stats</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {commentary?.matchHeader?.matchDescription ||
                        "Match Info"}
                    </span>
                  </div>
                </div>

                {/* Chart section */}
                <div className="pr-3 py-3 md:py-4 md:pr-4">
                  <h3 className="text-sm pl-4 font-medium mb-3">
                    Run Rate Chart
                  </h3>
                  <div className="h-48 relative right-4 md:h-64" ref={chartRef}>
                    {graphData && graphData.length > 0 ? (
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
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No data available to display chart
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {venuStats?.venueStats && (
                <div>
                  <VenueStats venueData={venuStats} />
                </div>
              )}
            </div>

            {/* Center - Main match analytics */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2">
              {/* Match Header for Desktop */}
              {data?.matchInfo && (
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-blue-900 text-white rounded-full">
                        {data?.matchInfo?.series?.name}
                      </span>
                      <div>
                        <MatchCountdown
                          matchStartTimestamp={
                            data?.matchInfo?.matchStartTimestamp
                          }
                        />
                      </div>
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
                  {activeTab === "Info" && (
                    <ScoreCard
                      score={score}
                      overSummaryList={overData}
                      pointsTableData={pTable}
                    />
                  )}
                  {activeTab === "Squads" && <Sqads data={data} />}
                  {activeTab === "Commentary" && (
                    <div className="p-2 md:p-4">
                      <h2 className="text-lg font-semibold mb-4">
                        Match Commentary
                      </h2>
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
                  )}
                </div>
              </div>

              {/* Match Videos Section */}
              <div className="mt-4"></div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            {pTable.pointsTable && (
              <TeamComparisonCard
                team1={pTable?.pointsTable[0].pointsTableInfo.find(
                  (e) => e.teamName === data?.matchInfo?.team1?.shortName
                )}
                team2={pTable?.pointsTable[0].pointsTableInfo.find(
                  (e) => e.teamName === data?.matchInfo?.team2?.shortName
                )}
              />
            )}
          </div>
          <MatchOdds sofaData={sofaData} />
        </div>
      </div>

      <TrendingPlayers />
      <EditorPicks />
    </div>
  );
};

export default AnalyticsMatch;
