import React, { useMemo, useState } from "react";
import Overs from "./Overs";
import toast from "react-hot-toast";

export default function ScoreCard({ score, overSummaryList, pointsTableData }) {
  const scoreCardTabs = ["Overs", "1st Innings", "2nd Innings", "Points Table"];
  const [selectedScoreCardTab, setSelectedScoreTab] = useState(
    overSummaryList ? 0 : 3
  );

  console.log(overSummaryList);
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

  // Helper function to get values from an object
  const getValues = (data) => {
    if (data) return Object.values(data);
    return [];
  };

  // Determine which data structure we're working with
  const isLegacyFormat = useMemo(() => {
    return !!score?.scoreCard;
  }, [score]);

  const isNewFormat = useMemo(() => {
    return !!score?.scorecard;
  }, [score]);

  // Get the appropriate batters based on format
  const getBattersData = () => {
    if (isLegacyFormat) {
      return getValues(
        score?.scoreCard[selectedScoreCardTab - 1]?.batTeamDetails?.batsmenData
      );
    } else if (isNewFormat) {
      return getBatters(score?.scorecard[selectedScoreCardTab - 1]);
    }
    return [];
  };

  // Get the appropriate bowlers based on format
  const getBowlersData = () => {
    if (isLegacyFormat) {
      return getValues(
        score?.scoreCard[selectedScoreCardTab - 1]?.bowlTeamDetails?.bowlersData
      );
    } else if (isNewFormat) {
      return getBowlers(score?.scorecard[selectedScoreCardTab - 1]);
    }
    return [];
  };

  // Check if there's data available
  const hasData = () => {
    if (isLegacyFormat) {
      return score?.scoreCard?.length > 0;
    } else if (isNewFormat) {
      return score?.scorecard?.length > 0;
    }
    return false;
  };

  return (
    <div className="divide-y divide-gray-200  overflow-y-auto">
      {/* Tabs */}
      <div className="flex mx-2 md:mx-4 flex-wrap gap-2 py-2">
        {scoreCardTabs.map((section, i) => (
          <button
            key={section}
            className={`py-2 px-4 text-sm rounded-md transition-colors ${
              selectedScoreCardTab === i
                ? "bg-blue-800 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedScoreTab(i)}
          >
            {section.toUpperCase()}
          </button>
        ))}
      </div>

      {(selectedScoreCardTab === 1 || selectedScoreCardTab === 2) && (
        <>
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
                  {hasData() &&
                    getBattersData()?.map((batter, index) => (
                      <tr
                        key={index}
                        className="text-sm border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 font-semibold px-2 whitespace-nowrap">
                          {isLegacyFormat ? batter.batName : batter.name}
                        </td>
                        <td className="py-2 px-2 text-center font-medium">
                          {batter.runs}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {batter.balls}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {batter.fours}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {batter.sixes || 0}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {isLegacyFormat ? batter.strikeRate : batter.strkRate}
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
                <tbody className="divide-y divide-gray-200">
                  {hasData() &&
                    getBowlersData()?.map((bowler, index) => (
                      <tr key={index} className="text-sm hover:bg-gray-50">
                        <td className="py-2 font-semibold px-2 whitespace-nowrap">
                          {isLegacyFormat ? bowler.bowlName : bowler.name}
                        </td>
                        <td className="py-2 px-2 text-center">
                          {bowler.overs}
                        </td>
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
        </>
      )}

      {selectedScoreCardTab === 0 && (
        <Overs overSummaryList={overSummaryList} />
      )}

      {selectedScoreCardTab === 3 && (
        <PointsTable pointsTableData={pointsTableData} />
      )}
    </div>
  );
}

// Points Table Component
function PointsTable({ pointsTableData }) {
  const [expandedTeam, setExpandedTeam] = useState();

  // Function to render match result circle
  const renderResultCircle = (result) => {
    const colors = {
      W: "bg-green-500",
      L: "bg-red-500",
      D: "bg-blue-500",
      A: "bg-yellow-500",
      default: "bg-gray-300",
    };

    return (
      <div
        className={`w-4 h-4 ${
          colors[result] || colors.default
        } text-white rounded-full flex items-center justify-center text-xs`}
      >
        {result || "-"}
      </div>
    );
  };

  // Toggle team expansion for mobile view
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  // If no points table data is available
  if (!pointsTableData?.pointsTable?.[0]?.pointsTableInfo) {
    return (
      <div className="p-4 text-center text-gray-500">
        Points table data is not available
      </div>
    );
  }

  return (
    <div className="bg-white w-full my-4">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 p-3">
        {pointsTableData?.appIndex?.seoTitle?.split("|")[0] || "Points Table"}
      </h2>

      {/* Desktop version - Full table */}
      <div className="hidden sm:block px-3 pb-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-2 text-left">Team</th>
                <th className="py-2 px-1 text-center">M</th>
                <th className="py-2 px-1 text-center">W</th>
                <th className="py-2 px-1 text-center">L</th>
                <th className="py-2 px-1 text-center">D</th>
                <th className="py-2 px-1 text-center">Pts</th>
                <th className="py-2 px-1 text-center">NRR</th>
                <th className="py-2 px-1 text-center">Form</th>
              </tr>
            </thead>
            <tbody>
              {pointsTableData?.pointsTable?.[0]?.pointsTableInfo?.map(
                (team, i) => (
                  <tr
                    key={team.teamId}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-2">
                      <span className="font-medium">{team.teamName}</span>
                    </td>
                    <td className="py-2 px-1 text-center">
                      {team.matchesPlayed || 0}
                    </td>
                    <td className="py-2 px-1 text-center">
                      {team.matchesWon || 0}
                    </td>
                    <td className="py-2 px-1 text-center">
                      {team.matchesLost || 0}
                    </td>
                    <td className="py-2 px-1 text-center">
                      {team.matchesDraw || 0}
                    </td>
                    <td className="py-2 px-1 text-center font-medium">
                      {team.points || 0}
                    </td>
                    <td className="py-2 px-1 text-center">{team.nrr || 0}</td>
                    <td className="py-2 px-1">
                      <div className="flex gap-1 justify-center">
                        {team?.form?.slice(0, 5).map((result, index) => (
                          <div key={index}>{renderResultCircle(result)}</div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile version - Simplified cards */}
      <div className="sm:hidden px-3 pb-3">
        {pointsTableData?.pointsTable?.[0]?.pointsTableInfo?.map((team, i) => (
          <div key={team.teamId} className="border-b border-gray-200 py-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleTeamExpansion(team.teamId)}
            >
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">{i + 1}.</span>
                <span className="font-medium w-[10rem] truncate">
                  {team.teamFullName || team.teamName}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="font-medium text-base">{team.points}</span>
                  <span className="text-xs text-gray-500 ml-1">pts</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    expandedTeam === team.teamId ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedTeam === team.teamId && (
              <div className="pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Matches:</span>
                  <span>{team.matchesPlayed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Won:</span>
                  <span>{team.matchesWon || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lost:</span>
                  <span>{team.matchesLost || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drawn:</span>
                  <span>{team.matchesDraw || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>NRR:</span>
                  <span>{team.nrr || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Form:</span>
                  <div className="flex gap-1">
                    {team?.form?.slice(0, 5).map((result, index) => (
                      <div key={index}>{renderResultCircle(result)}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend - Simplified and responsive */}
      <div className="text-xs text-gray-500 px-3 pb-3 flex flex-wrap gap-x-3 gap-y-1">
        <span>M: Matches</span>
        <span>W: Won</span>
        <span>L: Lost</span>
        <span>D: Drawn</span>
        <span>Pts: Points</span>
        <span>NRR: Net Run Rate</span>
      </div>
    </div>
  );
}
