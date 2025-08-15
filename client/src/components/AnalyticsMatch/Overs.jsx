import React from "react";
import { User, Circle, Award, Clock, Target } from "lucide-react";

export default function Overs({ overSummaryList }) {
  // Check if there's over summary data available
  const hasOverData =
    Array.isArray(overSummaryList) && overSummaryList.length > 0;

  // Helper function to convert ball values to styled components
  const renderBall = (value) => {
    const trimmedValue = value.trim();

    let bgColor = "bg-gray-200 dark:bg-gray-600"; // Default color for dot balls
    let textColor = "text-gray-800 dark:text-gray-200";
    let icon = null;

    if (trimmedValue === "W") {
      bgColor = "bg-red-500 dark:bg-red-600";
      textColor = "text-white";
    } else if (trimmedValue === "4") {
      bgColor = "bg-blue-500 dark:bg-blue-600";
      textColor = "text-white";
    } else if (trimmedValue === "6") {
      bgColor = "bg-purple-600 dark:bg-purple-700";
      textColor = "text-white";
    } else if (trimmedValue.startsWith("Wd")) {
      bgColor = "bg-yellow-400 dark:bg-yellow-500";
      textColor = "text-gray-800 dark:text-gray-900";
    } else if (["1", "2", "3"].includes(trimmedValue)) {
      bgColor = "bg-green-500 dark:bg-green-600";
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

  if (!hasOverData) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
        <div className="p-10 text-center">
          <div className="text-gray-600 dark:text-gray-300 font-medium">
            We could not find the over summary for this match.
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Check back later for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border dark:border-gray-700">
      {overSummaryList.map((over, index) => {
        // Check if this over has valid data
        if (!over || !over.overSummary) {
          return null;
        }

        // Format over number correctly
        const displayOverNum = over.overNum
          ? Math.ceil(over.overNum)
          : index + 1;

        // Convert over summary to array of balls, handling potential null/undefined values
        const balls = over.overSummary
          ? over.overSummary
              .trim()
              .split(" ")
              .filter((ball) => ball !== "")
          : [];

        // Get batsmen details with null checks
        const batsman1 = over.ovrBatNames?.[0] || "Unknown";
        const batsman2 = over.ovrBatNames?.[1] || "";

        // Get bowler details with null check
        const bowlerName = over.ovrBowlNames?.[0] || "Unknown";

        return (
          <div
            key={index}
            className="border-b border-gray-100 dark:border-gray-600 last:border-none"
          >
            {/* Over Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-5 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-sm">
                  {displayOverNum}
                </div>
                <div>
                  <div className="text-xs text-blue-500 dark:text-blue-400 uppercase font-semibold">
                    {over.battingTeamName || "Team"}
                  </div>
                  <div className="text-xl font-bold dark:text-gray-100">
                    {over.score || 0}/{over.wickets || 0}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-green-600 dark:text-green-400 uppercase font-semibold">
                  Runs
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  +{over.runs || 0}
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              {/* Players section */}
              <div className="flex ">
                {/* Batters column */}
                <div className="w-1/2 pr-3">
                  <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <User size={16} className="mr-1" />
                    <span>BATTING</span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                      <span className="font-medium dark:text-gray-200">
                        {batsman1}
                      </span>
                    </div>
                    <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                      On Strike
                    </div>
                  </div>

                  {batsman2 && (
                    <div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full mr-2"></div>
                        <span className="font-medium dark:text-gray-200">
                          {batsman2}
                        </span>
                      </div>
                      <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                        Non-striker
                      </div>
                    </div>
                  )}
                </div>

                {/* Bowler column */}
                <div className="w-1/2 pl-3 border-l border-gray-100 dark:border-gray-600">
                  <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <Target size={16} className="mr-1" />
                    <span>BOWLING</span>
                  </div>

                  <div>
                    <div className="font-medium dark:text-gray-200">
                      {bowlerName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="mr-3">
                        <Clock size={14} className="inline mr-1" />
                        {Math.floor(over.overNum || 0)}.
                        {Math.floor(((over.overNum || 0) % 1) * 10)}
                      </div>
                      <div className="mr-3">
                        <Circle size={14} className="inline mr-1" />
                        {over.runs || 0}
                      </div>
                      <div>
                        <Award size={14} className="inline mr-1" />
                        {over.wickets || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Over summary balls */}
              <div>
                <div className="text-sm text-center font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  THIS OVER
                </div>
                <div className="flex flex-wrap justify-center">
                  {balls.length > 0 ? (
                    balls.map((ball, idx) => (
                      <React.Fragment key={idx}>
                        {renderBall(ball)}
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 italic text-sm">
                      No ball information available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
