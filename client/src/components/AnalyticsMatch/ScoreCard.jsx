import React, { useMemo, useState } from "react";
import Overs from "./Overs";

export default function ScoreCard({ score, overSummaryList }) {
  const scoreCardTabs = ["1st Innings", "2nd Innings", "Overs"];
  const [selectedScoreCardTab, setSelectedScoreTab] = useState(0);

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
  return (
    <div className="divide-y divide-gray-200">
      {/* Batters Table */}
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

      {selectedScoreCardTab <= 1 && (
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
                  {score?.scorecard?.length > 0 &&
                    getBatters(score?.scorecard[selectedScoreCardTab]).map(
                      (batter, index) => (
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
                            {batter.strkRate}
                          </td>
                        </tr>
                      )
                    )}
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
                    getBowlers(score?.scorecard[selectedScoreCardTab]).map(
                      (bowler, index) => (
                        <tr
                          key={index}
                          className="text-sm border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-2 px-2 whitespace-nowrap">
                            {bowler.name}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {bowler.overs}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {bowler.maidens || 0}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {bowler.runs}
                          </td>
                          <td className="py-2 px-2 text-center font-medium">
                            {bowler.wickets}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {bowler.economy}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedScoreCardTab === 2 && (
        <Overs overSummaryList={overSummaryList} />
      )}
    </div>
  );
}
