import React from "react";
import { FaTrophy } from "react-icons/fa";

export default function TopNewsSeriesTable() {
  const iplTable = [
    { position: 1, team: "RCB*", matches: 10, points: 30, nrr: "+2.225" },
    { position: 2, team: "GT*", matches: 10, points: 27, nrr: "+2.054" },
    { position: 3, team: "CSK", matches: 10, points: 24, nrr: "+1.345" },
  ];
  return (
    <div>
      {/* Top News section */}
      <div className="border-t border bg-white rounded-lg shadow-lg border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-bold">Top News</h2>

          <div className="flex mt-4">
            <div className="w-2/3 pr-4">
              <h3 className="font-bold text-base">
                India make the most of Australia's sweep stumble
              </h3>
              <div className="text-xs text-gray-500 mt-2">
                CRICJAM, 11 min ago
              </div>
            </div>
            <div className="w-1/3">
              <img
                src="/api/placeholder/200/120"
                alt="Cricket news"
                className="w-full h-24 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* IPL Table */}
      <div className="border bg-white shadow-lg mt-6 rounded-lg  border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">IPL Table</h2>
            <div className="text-sm text-gray-500">India</div>
          </div>
          <div>
            <img src="/api/placeholder/80/40" alt="IPL Logo" className="h-10" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="text-left py-1">#</th>
              <th className="text-left py-1">Team</th>
              <th className="text-center py-1">M</th>
              <th className="text-center py-1">P</th>
              <th className="text-right py-1">NRR</th>
            </tr>
          </thead>
          <tbody>
            {iplTable.map((team, index) => (
              <tr key={index} className="text-sm border-t border-gray-200">
                <td className="py-2">{team.position}</td>
                <td className="py-2">
                  <div className="flex items-center">
                    {team.team === "RCB*" && (
                      <FaTrophy className="text-yellow-400 mr-2 text-sm" />
                    )}
                    {team.team === "GT*" && (
                      <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                    )}
                    {team.team === "CSK" && (
                      <div className="w-4 h-4 bg-yellow-300 rounded-full mr-2"></div>
                    )}
                    {team.team}
                  </div>
                </td>
                <td className="text-center py-2">{team.matches}</td>
                <td className="text-center py-2">{team.points}</td>
                <td className="text-right py-2">{team.nrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
