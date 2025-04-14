import React from "react";
import { User, Circle, Award, Clock, Target } from "lucide-react";

export default function Overs({ overSummaryList }) {
  // Helper function to convert ball values to styled components
  const renderBall = (value) => {
    const trimmedValue = value.trim();

    let bgColor = "bg-gray-200"; // Default color for dot balls
    let textColor = "text-gray-800";
    let icon = null;

    if (trimmedValue === "W") {
      bgColor = "bg-red-500";
      textColor = "text-white";
    } else if (trimmedValue === "4") {
      bgColor = "bg-blue-500";
      textColor = "text-white";
    } else if (trimmedValue === "6") {
      bgColor = "bg-purple-600";
      textColor = "text-white";
    } else if (trimmedValue.startsWith("Wd")) {
      bgColor = "bg-yellow-400";
      textColor = "text-gray-800";
    } else if (["1", "2", "3"].includes(trimmedValue)) {
      bgColor = "bg-green-500";
      textColor = "text-white";
    }

    return (
      <div
        className={`${bgColor} ${textColor} w-14 h-8 rounded text-center flex items-center justify-center font-bold text-sm mx-1 shadow-sm`}
      >
        {trimmedValue}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {overSummaryList.map((over, index) => {
        // Format over number correctly
        const displayOverNum = Math.ceil(over.overNum);

        // Convert over summary to array of balls
        const balls = over.o_summary
          .trim()
          .split(" ")
          .filter((ball) => ball !== "");

        // Get batsmen details
        const batsman1 = over.batStrikerNames[0] || "";
        const batsman2 = over.batStrikerNames[1] || "";

        // Get bowler details
        const bowlerName = over.bowlNames[0] || "";

        return (
          <div
            key={index}
            className="border-b border-gray-100 last:border-none"
          >
            {/* Over Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-sm">
                  {displayOverNum}
                </div>
                <div>
                  <div className="text-xs text-blue-500 uppercase font-semibold">
                    {over.batTeamName}
                  </div>
                  <div className="text-xl font-bold">
                    {over.score}/{over.wickets}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-green-600 uppercase font-semibold">
                  Runs
                </div>
                <div className="text-xl font-bold text-green-600">
                  +{over.runs}
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              {/* Players section */}
              <div className="flex ">
                {/* Batters column */}
                <div className="w-1/2 pr-3">
                  <div className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                    <User size={16} className="mr-1" />
                    <span>BATTING</span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium">{batsman1}</span>
                    </div>
                    <div className="ml-4 text-sm text-gray-600">
                      {over.batStrikerRuns} ({over.batStrikerBalls})
                    </div>
                  </div>

                  {batsman2 && (
                    <div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                        <span className="font-medium">{batsman2}</span>
                      </div>
                      <div className="ml-4 text-sm text-gray-600">
                        {over.batNonStrikerRuns} ({over.batNonStrikerBalls})
                      </div>
                    </div>
                  )}
                </div>

                {/* Bowler column */}
                <div className="w-1/2 pl-3 border-l border-gray-100">
                  <div className="flex items-center text-sm font-semibold text-gray-500 mb-2">
                    <Target size={16} className="mr-1" />
                    <span>BOWLING</span>
                  </div>

                  <div>
                    <div className="font-medium">{bowlerName}</div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <div className="mr-3">
                        <Clock size={14} className="inline mr-1" />
                        {over.bowlOvers}
                      </div>
                      <div className="mr-3">
                        <Circle size={14} className="inline mr-1" />
                        {over.bowlRuns}
                      </div>
                      <div>
                        <Award size={14} className="inline mr-1" />
                        {over.bowlWickets}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Over summary balls */}
              <div>
                <div className="text-sm text-center font-semibold text-gray-500 mb-2">
                  THIS OVER
                </div>
                <div className="flex flex-wrap justify-center">
                  {balls.map((ball, idx) => (
                    <React.Fragment key={idx}>
                      {renderBall(ball)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
