import React from "react";
import Image from "../Image";

export default function Sqads({ data }) {
  // Get player role color
  const getRoleColor = (role) => {
    if (role?.includes("Batsman")) return "bg-blue-100 text-blue-800";
    if (role?.includes("Bowler")) return "bg-green-100 text-green-800";
    if (role?.includes("Allrounder")) return "bg-purple-100 text-purple-800";
    if (role?.includes("WK")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-2 md:p-4">
      {data?.matchInfo?.team1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Image
              faceImageId={data.matchInfo.team1.imageId}
              className="h-6 w-6"
            />
            <h3 className="font-bold text-lg">{data.matchInfo.team1.name}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {data.matchInfo.team1.playerDetails
              ?.filter((player) => !player.isSupportStaff && !player.substitute)
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() => navigate("/cricket/player/" + player.id)}
                  className="border cursor-pointer border-gray-200 rounded-lg p-2 md:p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      faceImageId={player?.faceImageId}
                      className="h-8 w-8 rounded-full object-cover"
                      alt={player.fullName}
                    />
                    <div className="font-medium truncate">
                      {player.fullName}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {player.captain && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                        Captain
                      </span>
                    )}
                    {player.keeper && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Keeper
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-0.5 rounded ${getRoleColor(
                        player.role
                      )}`}
                    >
                      {player.role}
                    </span>
                    {player.isOverseas && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        Overseas
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {player.battingStyle} Bat
                    </span>
                    {player.bowlingStyle && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.bowlingStyle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {data?.matchInfo?.team2 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image
              faceImageId={data.matchInfo.team2.imageId}
              className="h-6 w-6"
              alt={data.matchInfo.team2.name}
            />
            <h3 className="font-bold text-lg">{data.matchInfo.team2.name}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {data.matchInfo.team2.playerDetails
              ?.filter((player) => !player.isSupportStaff && !player.substitute)
              .map((player) => (
                <div
                  onClick={() => navigate("/cricket/player/" + player.id)}
                  key={`team2-${player.id}`}
                  className="border cursor-pointer border-gray-200 rounded-lg p-2 md:p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      faceImageId={player?.faceImageId}
                      className="h-8 w-8 rounded-full object-cover"
                      alt={player.fullName}
                    />
                    <div className="font-medium truncate">
                      {player.fullName}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {player.captain && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                        Captain
                      </span>
                    )}
                    {player.keeper && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Keeper
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-0.5 rounded ${getRoleColor(
                        player.role
                      )}`}
                    >
                      {player.role}
                    </span>
                    {player.isOverseas && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        Overseas
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {player.battingStyle} Bat
                    </span>
                    {player.bowlingStyle && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.bowlingStyle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
