import React, { useEffect, useState } from "react";
import { FaCaretDown, FaAngleDown } from "react-icons/fa";
import TopNews from "../components/TopNews";
import { useParams } from "react-router-dom";
import apiClient from "../utils/axios";
import EditorPicks from "../components/EditorPicks";
import Gallery from "../components/Gallery";

const PointsTable = () => {
  const [season, setSeason] = useState("2021-22 Season");

  // State to track selected category
  const [selectedCategory, setSelectedCategory] = useState("Plunket Shield");
  const [data, setData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(
          `/stats/v1/series/${id || "7572"}/points-table`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [id]);

  // Function to render match result circle
  const renderResultCircle = (result) => {
    if (result === "W") {
      return (
        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
          W
        </div>
      );
    } else if (result === "L") {
      return (
        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
          L
        </div>
      );
    } else if (result === "D") {
      return (
        <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
          D
        </div>
      );
    } else if (result === "A") {
      return (
        <div className="w-5 h-5 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs">
          A
        </div>
      );
    } else {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
          -
        </div>
      );
    }
  };

  // Function to render team row for Plunket Shield
  const renderPlunketShieldTeamRow = (team, i) => (
    <tr key={team.teamId} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-2 text-center">{i + 1}</td>
      <td className="py-3 px-3 flex items-center gap-2">
        <span className="font-medium">{team.teamName}</span>
      </td>
      <td className="py-3 px-2 text-center">{team.matchesPlayed || 0}</td>
      <td className="py-3 px-2 text-center">{team.matchesWon || 0}</td>
      <td className="py-3 px-2 text-center">{team.matchesLost || 0}</td>
      <td className="py-3 px-2 text-center">{team.matchesTied || 0}</td>
      <td className="py-3 px-2 text-center">{team.matchesDraw || 0}</td>
      <td className="py-3 px-2 text-center">{team.noRes || 0}</td>
      <td className="py-3 px-2 text-center font-medium">{team.points || 0}</td>
      <td className="py-3 px-2 text-center">{team.nrr || 0}</td>
      <td className="py-3 px-2">
        <div className="flex gap-1 justify-center">
          {team?.form?.slice(0, 5).map((result, index) => (
            <div key={index}>{renderResultCircle(result)}</div>
          ))}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="mx-auto overflow-hidden">
      {/* Navigation tabs */}

      <div className="flex gap-6">
        <div className="bg-white border w-3/4 border-gray-300 rounded-lg shadow-lg">
          <>
            <h2 className="text-xl p-5 font-bold text-gray-800">
              {data?.appIndex?.seoTitle.split("|")[0]}
            </h2>

            {/* Teams Table */}
            <div className="px-4">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="py-3 px-2 text-left">No</th>
                    <th className="py-3 px-2 text-left">TEAMS</th>
                    <th className="py-3 px-2 text-center">M</th>
                    <th className="py-3 px-2 text-center">W</th>
                    <th className="py-3 px-2 text-center">L</th>
                    <th className="py-3 px-2 text-center">T</th>
                    <th className="py-3 px-2 text-center">D</th>
                    <th className="py-3 px-2 text-center">N/R</th>
                    <th className="py-3 px-2 text-center">PTS</th>
                    <th className="py-3 px-2 text-center">Net RR</th>
                    <th className="py-3 px-2 text-center">Last 5 Matches</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.pointsTable?.length > 0 &&
                    data?.pointsTable[0]?.pointsTableInfo?.map((team, i) =>
                      renderPlunketShieldTeamRow(team, i)
                    )}
                </tbody>
              </table>
            </div>
            {/* Footer with legend */}
            <div className="p-4 mt-2 text-sm text-gray-600">
              <span className="mr-3">
                <strong>M:</strong> Matches,
              </span>
              <span className="mr-3">
                <strong>W:</strong> Won,
              </span>
              <span className="mr-3">
                <strong>L:</strong> Lost,
              </span>
              <span className="mr-3">
                <strong>T:</strong> Tie,
              </span>
              <span className="mr-3">
                <strong>D:</strong> Drawn,
              </span>
              <span className="mr-3">
                <strong>N/R:</strong> No Result,
              </span>
              <span className="mr-3">
                <strong>PTS:</strong> Points,
              </span>
              <span className="mr-3">
                <strong>Net RR:</strong> Net run rate
              </span>
            </div>
          </>
        </div>
        <div className="w-1/3">
          <TopNews />
        </div>
      </div>
      <EditorPicks />
      <Gallery id={3} />
    </div>
  );
};

export default PointsTable;
