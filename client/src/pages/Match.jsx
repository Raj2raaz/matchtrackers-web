import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";
import TrendingPlayers from "../components/TrendingPlayers";
import volleyballPoster from "../assets/volleyballPoster.png";
import TopNews from "../components/TopNews";
import { useNavigate, useParams } from "react-router-dom";
import { cricApiClient as apiClient } from "../utils/axios";
import Image from "../components/Image";
import MatchVideosSection from "../components/MatchVideosSection";
import YtShorts from "../components/YtShorts";

const Match = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [score, setScore] = useState(null);
  const [commentary, setCommentary] = useState(null);
  const [activeTab, setActiveTab] = useState("Info");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [matchResponse, scoreResponse, commResponse] = await Promise.all([
          apiClient.get(`/mcenter/v1/${id}`),
          apiClient.get(`/mcenter/v1/${id}/scard`),
          apiClient.get(`/mcenter/v1/${id}/comm`),
        ]);

        setData(matchResponse.data);
        setScore(scoreResponse.data);
        setCommentary(commResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const tabs = [
    {
      id: "Info",
      icon: <FaInfoCircle className="mr-2" />,
      label: "Match Info",
    },
    { id: "Squads", icon: <FaUsers className="mr-2" />, label: "Squads" },
  ];

  const getBatters = (scorecard) => {
    return scorecard?.batsman.filter((batsman) => batsman.balls > 0) || [];
  };

  const getBowlers = (scorecard) => {
    return scorecard?.bowler.filter((bowler) => bowler.overs) || [];
  };

  // Get player role color
  const getRoleColor = (role) => {
    if (role.includes("Batsman")) return "bg-blue-100 text-blue-800";
    if (role.includes("Bowler")) return "bg-green-100 text-green-800";
    if (role.includes("Allrounder")) return "bg-purple-100 text-purple-800";
    if (role.includes("WK")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Render squads tab content
  const renderSquadsTab = () => {
    return (
      <div className="p-4">
        {data?.matchInfo?.team1 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={`/team-logos/${data.matchInfo.team1.id}.png`}
                fallback="/team-default.png"
                className="h-6 w-6"
                alt={data.matchInfo.team1.name}
              />
              <h3 className="font-bold text-lg">{data.matchInfo.team1.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.matchInfo.team1.playerDetails
                .filter(
                  (player) => !player.isSupportStaff && !player.substitute
                )
                .map((player) => (
                  <div
                    key={player.id}
                    onClick={() => navigate("/player/" + player.id)}
                    className="border cursor-pointer border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        faceImageId={player?.faceImageId}
                        className="h-8 w-8 rounded-full object-cover"
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
                src={`/team-logos/${data.matchInfo.team2.id}.png`}
                fallback="/team-default.png"
                className="h-6 w-6"
                alt={data.matchInfo.team2.name}
              />
              <h3 className="font-bold text-lg">{data.matchInfo.team2.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.matchInfo.team2.playerDetails
                .filter(
                  (player) => !player.isSupportStaff && !player.substitute
                )
                .map((player) => (
                  <div
                    onClick={() => navigate("/player/" + player.id)}
                    key={`team2-${player.id}`}
                    className="border cursor-pointer border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        faceImageId={player?.faceImageId}
                        className="h-8 w-8 rounded-full object-cover"
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
        <div className="p-4">
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
                      <td className="py-2.5 px-2">{batter.name}</td>
                      <td className="py-2.5 px-2 text-center font-medium">
                        {batter.runs}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {batter.balls}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {batter.fours}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {batter.sixes || 0}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {batter.strkRate}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bowlers Table */}
        <div className="p-4">
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
                      <td className="py-2.5 px-2">{bowler.name}</td>
                      <td className="py-2.5 px-2 text-center">
                        {bowler.overs}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {bowler.maidens || 0}
                      </td>
                      <td className="py-2.5 px-2 text-center">{bowler.runs}</td>
                      <td className="py-2.5 px-2 text-center font-medium">
                        {bowler.wickets}
                      </td>
                      <td className="py-2.5 px-2 text-center">
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 font-sans text-gray-800">
      {/* Match Header for Mobile */}
      {data?.matchInfo && (
        <div className="lg:hidden bg-white rounded-lg shadow-md p-4 ">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {commentary?.matchHeader?.seriesName}
            </span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {data.matchInfo.shortStatus}
            </span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div>
                <div className="font-bold">{data.matchInfo.team1.name}</div>
                <div className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team1.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}{" "}
                      ({score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}{" "}
                      ({score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <span className="text-xl">vs</span>
            <div className="flex items-center">
              <div className="text-right">
                <div className="font-bold">{data.matchInfo.team2.name}</div>
                <div className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team2.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}{" "}
                      ({score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}{" "}
                      ({score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-600 justify-center">
            <FaMapMarkerAlt className="mr-1" />
            <span>
              {data?.matchInfo?.venue?.name}, {data?.matchInfo?.venue?.city}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Live Score Card */}
        <div className="w-full lg:w-1/3 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
            {/* Header with team score */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                  {commentary?.miniscore?.batTeam?.teamScore}/
                  {commentary?.miniscore?.batTeam?.teamWkts}
                </h1>
                <span className="text-sm bg-blue-900 px-2 py-1 rounded-full">
                  {commentary?.miniscore?.matchStatus}
                </span>
              </div>
              <div className="text-xs mt-1 text-blue-100 flex items-center">
                <FaRegClock className="mr-1" />
                {commentary?.miniscore?.batTeam?.teamName} need{" "}
                {commentary?.miniscore?.target -
                  commentary?.miniscore?.batTeam?.teamScore}{" "}
                runs from {commentary?.miniscore?.remBalls} balls
              </div>
            </div>

            {/* Recent Balls - Visual timeline */}
            <div className="bg-gray-50 px-4 py-3">
              <div className="flex items-center mb-1">
                <span className="text-xs text-gray-500 mr-2">RECENT</span>
                <div className="flex space-x-1 overflow-x-auto pb-1">
                  {commentary?.miniscore?.recentOvsStats
                    ?.trim()
                    .split(/\s+/)
                    .slice(-8)
                    .map((ball, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium shrink-0
                      ${ball === "6" ? "bg-blue-600 text-white" : ""} 
                      ${ball === "4" ? "bg-green-500 text-white" : ""}
                      ${ball === "W" ? "bg-red-600 text-white font-bold" : ""} 
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
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    BATTING
                  </h2>

                  {/* Striker */}
                  <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-sm truncate">
                        {commentary?.miniscore?.batsmanStriker.batName}
                      </span>
                    </div>
                    <div className="flex mt-1">
                      <span className="text-xl font-bold mr-2">
                        {commentary?.miniscore?.batsmanStriker.batRuns}
                      </span>
                      <span className="text-xs text-gray-500 self-end mb-1">
                        ({commentary?.miniscore?.batsmanStriker.batBalls})
                      </span>
                    </div>
                    <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                      <span>
                        4s: {commentary?.miniscore?.batsmanStriker.batFours}
                      </span>
                      <span>
                        6s: {commentary?.miniscore?.batsmanStriker.batSixes}
                      </span>
                      <span>
                        SR:{" "}
                        {commentary?.miniscore?.batsmanStriker.batStrikeRate}
                      </span>
                    </div>
                  </div>

                  {/* Non-Striker */}
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-sm truncate">
                        {commentary?.miniscore?.batsmanNonStriker.batName}
                      </span>
                    </div>
                    <div className="flex mt-1">
                      <span className="text-xl font-bold mr-2">
                        {commentary?.miniscore?.batsmanNonStriker.batRuns}
                      </span>
                      <span className="text-xs text-gray-500 self-end mb-1">
                        ({commentary?.miniscore?.batsmanNonStriker.batBalls})
                      </span>
                    </div>
                    <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                      <span>
                        4s: {commentary?.miniscore?.batsmanNonStriker.batFours}
                      </span>
                      <span>
                        6s: {commentary?.miniscore?.batsmanNonStriker.batSixes}
                      </span>
                      <span>
                        SR:{" "}
                        {commentary?.miniscore?.batsmanNonStriker.batStrikeRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 sm:border-l sm:border-gray-200 sm:pl-4">
                  <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    BOWLING
                  </h2>

                  {/* Current Bowler */}
                  <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-sm truncate">
                        {commentary?.miniscore?.bowlerStriker.bowlName}
                      </span>
                    </div>
                    <div className="flex mt-1 items-end">
                      <span className="text-lg font-bold mr-2">
                        {commentary?.miniscore?.bowlerStriker.bowlWkts}
                      </span>
                      <span className="text-xs text-gray-500">
                        /{commentary?.miniscore?.bowlerStriker.bowlRuns}
                      </span>
                    </div>
                    <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                      <span>
                        Ovs: {commentary?.miniscore?.bowlerStriker.bowlOvs}
                      </span>
                      <span>
                        Econ: {commentary?.miniscore?.bowlerStriker.bowlEcon}
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
                        {commentary?.miniscore?.bowlerNonStriker.bowlWkts}
                      </span>
                      <span className="text-xs text-gray-500">
                        /{commentary?.miniscore?.bowlerNonStriker.bowlRuns}
                      </span>
                    </div>
                    <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                      <span>
                        Ovs: {commentary?.miniscore?.bowlerNonStriker.bowlOvs}
                      </span>
                      <span>
                        Econ: {commentary?.miniscore?.bowlerNonStriker.bowlEcon}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commentary section */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                LIVE COMMENTARY
              </h2>
              <div className="h-64 lg:h-80 overflow-y-auto rounded-lg bg-white p-2">
                {commentary?.commentaryList?.slice(0, 8).map((e, i) => (
                  <div
                    className={`text-sm py-2 px-2 ${
                      i !== 0 ? "border-t border-gray-100" : ""
                    } ${i === 0 ? "bg-blue-50 rounded" : ""}`}
                    key={i}
                  >
                    {e?.commText}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile News Section */}
          <div className="lg:hidden mb-4">
            <TopNews />
          </div>
        </div>
        {/* Match Details & Tabs */}
        {data?.matchInfo && (
          <div className="w-full lg:w-2/3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-4">
              {/* Match Header - Desktop only */}
              <div className="hidden lg:block p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700 mb-1 font-medium">
                    {commentary?.matchHeader?.seriesName}
                  </div>
                  {/* Venue information */}
                  <div className="flex items-center mb-1 text-xs text-gray-600">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>
                      {data?.matchInfo?.venue?.name},{" "}
                      {data?.matchInfo?.venue?.city}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div className="flex items-center">
                    <div>
                      <div className="font-bold">
                        {data.matchInfo.team1.name}
                      </div>
                      <div className="text-sm">
                        {score?.scorecard?.[0]?.batTeamName ===
                        data?.matchInfo?.team1.name ? (
                          <span className="font-medium">
                            {score?.scorecard[0].score}/
                            {score?.scorecard[0].wickets} (
                            {score?.scorecard[0].overs})
                          </span>
                        ) : score?.scorecard?.[1] ? (
                          <span className="font-medium">
                            {score?.scorecard[1].score}/
                            {score?.scorecard[1].wickets} (
                            {score?.scorecard[1].overs})
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg text-center">
                    <div className="text-xs text-gray-500">MATCH STATUS</div>
                    <div className="text-green-600 font-medium">
                      {data.matchInfo.shortStatus}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right">
                      <div className="font-bold">
                        {data.matchInfo.team2.name}
                      </div>
                      <div className="text                        ">
                        {" "}
                        {score?.scorecard?.[0]?.batTeamName ===
                        data?.matchInfo?.team2.name ? (
                          <span className="font-medium">
                                                       {" "}
                            {score?.scorecard[0].score}/
                            {score?.scorecard[0].wickets}                      
                                  ({score?.scorecard[0].overs})                
                                     {" "}
                          </span>
                        ) : score?.scorecard?.[1] ? (
                          <span className="font-medium">
                                                       {" "}
                            {score?.scorecard[1].score}/
                            {score?.scorecard[1].wickets}                      
                                  ({score?.scorecard[1].overs})                
                                     {" "}
                          </span>
                        ) : null}
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                                     {" "}
                  </div>
                                 {" "}
                </div>
                             {" "}
              </div>
                            {/* Tab Navigation */}             {" "}
              <div className="flex border-b border-gray-200">
                               {" "}
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-600/50"
                    }`}
                  >
                                       {" "}
                    <div className="flex items-center">
                                            {tab.icon}                     {" "}
                      {tab.label}                   {" "}
                    </div>
                                     {" "}
                  </button>
                ))}{" "}
              </div>
              {/* Tab Content */} {activeTab === "Info" && renderInfoTab()}{" "}
              {activeTab === "Squads" && renderSquadsTab()}{" "}
            </div>{" "}
          </div>
        )}
        {/* Trending Players (Desktop Only) */}{" "}
        <div className="w-full lg:w-1/3 order-3">
          {" "}
          <div className="hidden lg:block">
            <TrendingPlayers />{" "}
          </div>{" "}
        </div>
      </div>
      <MatchVideosSection commentary={commentary} />
    </div>
  );
};

export default Match;
