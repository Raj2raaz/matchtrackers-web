import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cricApiClient as apiClient } from "../utils/axios";
import TopNews from "../components/TopNews";
import EditorPicks from "../components/EditorPicks";
import Gallery from "../components/Gallery";
import { Helmet } from "react-helmet-async";

const PointsTable = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(
          `/stats/v1/series/${id || "7572"}/points-table`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [id]);

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

  return (
    <div className="mx-auto px-2 sm:px-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main table section */}
        <div className="bg-white border w-full mt-4 lg:w-2/3 border-gray-200 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 p-3">
            {data?.appIndex?.seoTitle?.split("|")[0] || "Points Table"}
          </h2>
          <Helmet>
            <title>POint Table</title>
            <meta name="description" content="Point table of series" />
            <meta property="og:title" content="Point Table | Match Trackers" />
            <meta property="og:description" content="Point Table Stats" />
            <meta
              property="og:image"
              content="https://matchtrackers.com/favicon.svg"
            />
            <meta property="og:url" content="https://matchtrackers.com/" />
            <meta name="twitter:card" content="summary_large_image" />
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

          {/* Desktop version - Full table */}
          <div className="hidden sm:block px-3 pb-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-1 text-left">#</th>
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
                  {data?.pointsTable?.[0]?.pointsTableInfo?.map((team, i) => (
                    <tr
                      key={team.teamId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-1 text-center">{i + 1}</td>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile version - Simplified cards */}
          <div className="sm:hidden px-3  pb-3">
            {data?.pointsTable?.[0]?.pointsTableInfo?.map((team, i) => (
              <div key={team.teamId} className="border-b border-gray-200 py-2">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleTeamExpansion(team.teamId)}
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">{i + 1}.</span>
                    <span className="font-medium w-[10rem] truncate">
                      {team.teamFullName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="font-medium text-base">
                        {team.points}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">pts</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedTeam === team.teamId
                          ? "transform rotate-180"
                          : ""
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

        {/* News section */}
        <div className="w-full lg:w-1/3">
          <TopNews />
        </div>
      </div>

      <div className="mt-4">
        <EditorPicks />
      </div>

      <div className="mt-4">
        <Gallery id={3} />
      </div>
    </div>
  );
};

export default PointsTable;
