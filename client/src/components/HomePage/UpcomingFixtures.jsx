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
    <div className="bg-gray-200 border w-full border-slate-300 rounded-xl p-5">
      <h1 className="font-bold text-lg">Upcoming Fixtures</h1>
      <p className="text-sm">
        What's next in cricket -- match dates, venues and squads
      </p>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 mt-4 gap-y-2">
          {upcomingMatches?.length > 0 &&
            upcomingMatches?.slice(0, 4).map((match, i) => (
              <div
                onClick={() =>
                  navigate("/cricket/match/" + match.matchInfo.matchId)
                }
                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer p-4"
                key={i}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {match.matchInfo.matchDesc}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {match.matchInfo.matchFormat}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.matchInfo.state === "In Progress"
                        ? "bg-red-500 text-white"
                        : match.matchInfo.state === "Complete"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {match.matchInfo.state}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Image
                      faceImageId={match.matchInfo.team1.imageId}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {match.matchInfo.team1.teamSName}
                        </span>
                        {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                          match.matchInfo.team1.teamSName && (
                          <span className="text-green-600 text-xs font-medium">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {match?.matchScore?.team1Score?.inngs1?.runs || 0}/
                        {match?.matchScore?.team1Score?.inngs1?.wickets || 0} (
                        {match?.matchScore?.team1Score?.inngs1?.overs === 19.6
                          ? 20
                          : match?.matchScore?.team1Score?.inngs1?.overs || 0}
                        )
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm font-medium mx-4">
                    vs
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end text-right">
                    <div>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-semibold text-gray-900">
                          {match.matchInfo.team2.teamSName}
                        </span>
                        {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                          match.matchInfo.team2.teamSName && (
                          <span className="text-green-600 text-xs font-medium">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
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
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{getReadableDate(match.matchInfo.startDate)}</span>
                  <div className="flex gap-3">
                    <button className="text-blue-600 font-semibold hover:text-blue-700">
                      Schedule
                    </button>
                    <button className="text-blue-600 font-semibold hover:text-blue-700">
                      Points
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
