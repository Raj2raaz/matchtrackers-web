import React, { useState } from "react";
import { FaCaretDown, FaAngleDown } from "react-icons/fa";
import TopNewsSeriesTable from "../components/TopNewsSeriesTable";

const PointsTable = () => {
  const [season, setSeason] = useState("2024 Season");

  // Data for Group A and Group B
  const groupAData = [
    {
      no: 2,
      team: "Australia Women",
      flag: "🇦🇺",
      matches: 4,
      won: 4,
      lost: 0,
      tied: 0,
      nr: 0,
      pts: 8,
      netRR: 2.223,
      lastMatches: ["W", "W", "W", "W", "-"],
    },
    {
      no: 4,
      team: "New Zealand Women",
      flag: "🇳🇿",
      matches: 4,
      won: 3,
      lost: 1,
      tied: 0,
      nr: 0,
      pts: 6,
      netRR: 0.879,
      lastMatches: ["W", "L", "W", "W", "-"],
    },
    {
      no: 6,
      team: "India Women",
      flag: "🇮🇳",
      matches: 4,
      won: 2,
      lost: 2,
      tied: 0,
      nr: 0,
      pts: 4,
      netRR: 0.322,
      lastMatches: ["L", "W", "W", "L", "-"],
    },
    {
      no: 8,
      team: "Pakistan Women",
      flag: "🇵🇰",
      matches: 4,
      won: 1,
      lost: 3,
      tied: 0,
      nr: 0,
      pts: 2,
      netRR: -1.04,
      lastMatches: ["W", "L", "L", "L", "-"],
    },
    {
      no: 9,
      team: "Sri Lanka Women",
      flag: "🇱🇰",
      matches: 4,
      won: 0,
      lost: 4,
      tied: 0,
      nr: 0,
      pts: 0,
      netRR: -2.173,
      lastMatches: ["L", "L", "L", "L", "-"],
    },
  ];

  const groupBData = [
    {
      no: 1,
      team: "West Indies Women",
      flag: "🏝",
      matches: 4,
      won: 3,
      lost: 1,
      tied: 0,
      nr: 0,
      pts: 6,
      netRR: 1.536,
      lastMatches: ["L", "W", "W", "W", "-"],
    },
    {
      no: 3,
      team: "South Africa Women",
      flag: "🇿🇦",
      matches: 4,
      won: 3,
      lost: 1,
      tied: 0,
      nr: 0,
      pts: 6,
      netRR: 1.382,
      lastMatches: ["W", "L", "W", "W", "-"],
    },
    {
      no: 5,
      team: "England Women",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      matches: 4,
      won: 3,
      lost: 1,
      tied: 0,
      nr: 0,
      pts: 6,
      netRR: 1.091,
      lastMatches: ["W", "W", "W", "L", "-"],
    },
    {
      no: 7,
      team: "Bangladesh Women",
      flag: "🇧🇩",
      matches: 4,
      won: 1,
      lost: 3,
      tied: 0,
      nr: 0,
      pts: 2,
      netRR: -0.844,
      lastMatches: ["W", "L", "L", "L", "-"],
    },
    {
      no: 10,
      team: "Scotland Women",
      flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      matches: 4,
      won: 0,
      lost: 4,
      tied: 0,
      nr: 0,
      pts: 0,
      netRR: -3.129,
      lastMatches: ["L", "L", "L", "L", "-"],
    },
  ];

  // Tournament categories
  const categories = [
    "Indian premier league",
    "T20 WORLD CUP",
    "ODIS",
    "Test Matches",
  ];

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
    } else {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">
          -
        </div>
      );
    }
  };

  // Function to render team row
  const renderTeamRow = (team) => (
    <tr key={team.no} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-2 text-center">{team.no}</td>
      <td className="py-3 px-3 flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          {team.flag === "🇦🇺" && (
            <img
              src="/api/placeholder/24/24"
              alt="Australia"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇳🇿" && (
            <img
              src="/api/placeholder/24/24"
              alt="New Zealand"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇮🇳" && (
            <img
              src="/api/placeholder/24/24"
              alt="India"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇵🇰" && (
            <img
              src="/api/placeholder/24/24"
              alt="Pakistan"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇱🇰" && (
            <img
              src="/api/placeholder/24/24"
              alt="Sri Lanka"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🏝" && (
            <img
              src="/api/placeholder/24/24"
              alt="West Indies"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇿🇦" && (
            <img
              src="/api/placeholder/24/24"
              alt="South Africa"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🏴󠁧󠁢󠁥󠁮󠁧󠁿" && (
            <img
              src="/api/placeholder/24/24"
              alt="England"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🇧🇩" && (
            <img
              src="/api/placeholder/24/24"
              alt="Bangladesh"
              className="w-6 h-6 rounded-full"
            />
          )}
          {team.flag === "🏴󠁧󠁢󠁳󠁣󠁴󠁿" && (
            <img
              src="/api/placeholder/24/24"
              alt="Scotland"
              className="w-6 h-6 rounded-full"
            />
          )}
        </div>
        <span className="font-medium">{team.team}</span>
      </td>
      <td className="py-3 px-2 text-center">{team.matches}</td>
      <td className="py-3 px-2 text-center">{team.won}</td>
      <td className="py-3 px-2 text-center">{team.lost}</td>
      <td className="py-3 px-2 text-center">{team.tied}</td>
      <td className="py-3 px-2 text-center">{team.nr}</td>
      <td className="py-3 px-2 text-center font-medium">{team.pts}</td>
      <td className="py-3 px-2 text-center">{team.netRR}</td>
      <td className="py-3 px-2">
        <div className="flex gap-1 justify-center">
          {team.lastMatches.map((result, index) => (
            <div key={index}>{renderResultCircle(result)}</div>
          ))}
        </div>
      </td>
      <td className="py-3 px-2 text-center">
        <button>
          <FaAngleDown className="text-gray-400" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className=" mx-auto  overflow-hidden">
      {/* Navigation tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`py-2 px-4 text-sm rounded-md ${
              index === 1
                ? "bg-blue-900 text-white"
                : "border border-gray-300 text-gray-800"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* ICC Women's T20 World Cup Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              ICC Women's T20 World Cup Points Table
            </h2>
            <p className="text-gray-600 mt-2">
              The highly-anticipated ICC Women's T20 World Cup 2024 is scheduled
              to be played from 3 October to 20 October in the United Arab
              Emirates....
            </p>
            <button className="text-blue-600 font-semibold mt-2">
              Read More
            </button>
          </div>
          {/* Header with dropdown */}
          <div className="px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">ICC Women's T20 World Cup</h3>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-full leading-tight focus:outline-none focus:shadow-outline"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option>2024 Season</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaCaretDown />
              </div>
            </div>
          </div>
          {/* Group A Table */}
          <div className="px-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-3 px-2 text-left">No</th>
                  <th className="py-3 px-2 text-left">GROUP A</th>
                  <th className="py-3 px-2 text-center">M</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center">T</th>
                  <th className="py-3 px-2 text-center">N/R</th>
                  <th className="py-3 px-2 text-center">PTS</th>
                  <th className="py-3 px-2 text-center">Net RR</th>
                  <th className="py-3 px-2 text-center">Last 5 Matches</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>{groupAData.map((team) => renderTeamRow(team))}</tbody>
            </table>
          </div>
          {/* Group B Table */}
          <div className="px-4 mt-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-3 px-2 text-left">No</th>
                  <th className="py-3 px-2 text-left">GROUP B</th>
                  <th className="py-3 px-2 text-center">M</th>
                  <th className="py-3 px-2 text-center">W</th>
                  <th className="py-3 px-2 text-center">L</th>
                  <th className="py-3 px-2 text-center">T</th>
                  <th className="py-3 px-2 text-center">N/R</th>
                  <th className="py-3 px-2 text-center">PTS</th>
                  <th className="py-3 px-2 text-center">Net RR</th>
                  <th className="py-3 px-2 text-center">Last 5 Matches</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>{groupBData.map((team) => renderTeamRow(team))}</tbody>
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
              <strong>N/R:</strong> No Result,
            </span>
            <span className="mr-3">
              <strong>PTS:</strong> Points,
            </span>
            <span className="mr-3">
              <strong>Net RR:</strong> Net run rate,
            </span>
            <span>
              <strong>Q:</strong> Qualified
            </span>
          </div>
        </div>
        <div>
          <TopNewsSeriesTable />
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
