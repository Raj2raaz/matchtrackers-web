import React from "react";
import Image from "../Image";

function getReadableDate(timestampMs) {
  const inputDate = new Date(Number(timestampMs));
  const today = new Date();

  const normalize = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const input = normalize(inputDate);
  const now = normalize(today);

  const diffTime = input.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";

  const day = inputDate.getDate();
  const month = inputDate.toLocaleString("default", { month: "short" });

  return `${day}, ${month}`;
}

export default function UpcomingFixtures({ upcomingMatches }) {
  return (
    <div className="bg-gray-200 dark:bg-gray-800 border border-slate-300 dark:border-slate-700 w-full rounded-xl p-5 transition-colors duration-300">
      <h1 className="font-bold text-base md:text-xl text-gray-900 dark:text-gray-100">
        Upcoming Fixtures
      </h1>
      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
        What's next in cricket -- match dates, venues and squads
      </p>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4">
        {upcomingMatches?.length > 0 &&
          upcomingMatches?.slice(0, 4).map((match, i) => (
            <div
              onClick={() =>
                navigate("/cricket/match/" + match.matchInfo.matchId)
              }
              key={i}
              className="
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
            rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer 
            p-2 md:p-4   /* tighter padding only on mobile */
            text-[11px] md:text-sm /* smaller text only on mobile */
            leading-tight /* reduce line height for compact look */
          "
            >
              {/* Match Header */}
              <div className="flex justify-between items-center mb-1.5 md:mb-3">
                <div className="flex items-center gap-1 md:gap-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] md:text-sm">
                    {match.matchInfo.matchDesc}
                  </span>
                  <span className="text-[9px] md:text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                    {match.matchInfo.matchFormat}
                  </span>
                </div>
                <span
                  className={`
                px-1.5 py-0.5 md:px-2 md:py-1 
                rounded-full text-[9px] md:text-xs font-medium 
                ${
                  match.matchInfo.state === "In Progress"
                    ? "bg-red-500 text-white"
                    : match.matchInfo.state === "Complete"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }
              `}
                >
                  {match.matchInfo.state}
                </span>
              </div>

              {/* Teams & Scores */}
              <div className="flex items-center justify-between mb-1.5 md:mb-3">
                {/* Team 1 */}
                <div className="flex items-center gap-1.5 md:gap-3 flex-1">
                  <Image
                    faceImageId={match.matchInfo.team1.imageId}
                    className="w-5 h-5 md:w-8 md:h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] md:text-sm">
                        {match.matchInfo.team1.teamSName}
                      </span>
                      {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                        match.matchInfo.team1.teamSName && (
                        <span className="text-green-600 dark:text-green-400 text-[9px] md:text-xs font-medium">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                      {match?.matchScore?.team1Score?.inngs1?.runs || 0}/
                      {match?.matchScore?.team1Score?.inngs1?.wickets || 0} (
                      {match?.matchScore?.team1Score?.inngs1?.overs === 19.6
                        ? 20
                        : match?.matchScore?.team1Score?.inngs1?.overs || 0}
                      )
                    </span>
                  </div>
                </div>

                {/* VS */}
                <div className="text-gray-400 dark:text-gray-500 text-[10px] md:text-sm font-medium mx-2 md:mx-4">
                  vs
                </div>

                {/* Team 2 */}
                <div className="flex items-center gap-1.5 md:gap-3 flex-1 justify-end text-right">
                  <div>
                    <div className="flex items-center gap-1 md:gap-2 justify-end">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] md:text-sm">
                        {match.matchInfo.team2.teamSName}
                      </span>
                      {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                        match.matchInfo.team2.teamSName && (
                        <span className="text-green-600 dark:text-green-400 text-[9px] md:text-xs font-medium">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400">
                      {match?.matchScore?.team2Score?.inngs1?.runs || 0}/
                      {match?.matchScore?.team2Score?.inngs1?.wickets || 0} (
                      {match?.matchScore?.team2Score?.inngs1?.overs === 19.6
                        ? 20
                        : match?.matchScore?.team2Score?.inngs1?.overs || 0}
                      )
                    </span>
                  </div>
                  <Image
                    faceImageId={match.matchInfo.team2.imageId}
                    className="w-5 h-5 md:w-8 md:h-8 rounded-full"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-[9px] md:text-xs text-gray-500 dark:text-gray-400">
                <span>{getReadableDate(match.matchInfo.startDate)}</span>
                <div className="flex gap-2 md:gap-3">
                  <button className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
                    Schedule
                  </button>
                  <button className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">
                    Points
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
