import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PlayerStatisticsDetail = ({ stats }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Comprehensive Player Statistics
      </h2>

      <div className="space-y-4">
        {stats?.map((statEntry, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(index)}
            >
              <div>
                <h3 className="text-xl font-semibold">
                  {statEntry.team?.name || "Unknown Team"} -{" "}
                  {statEntry.league?.name || "Unknown League"}
                </h3>
                <p className="text-gray-600">
                  {statEntry.league?.country || "Unknown Country"}
                </p>
              </div>
              <div className="flex items-center">
                {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>

            {expandedIndex === index && (
              <div className="p-4 grid md:grid-cols-3 gap-4">
                {/* Team & League Info */}
                <div>
                  <h4 className="font-bold mb-2 border-b pb-1">Team Details</h4>
                  <div className="space-y-2">
                    <img
                      src={statEntry.team?.logo || "/default-team-logo.png"}
                      alt={statEntry.team?.name}
                      className="w-24 h-24 object-contain mx-auto mb-2"
                    />
                    <p>
                      <strong>Team:</strong> {statEntry.team?.name || "N/A"}
                    </p>
                    <p>
                      <strong>League:</strong> {statEntry.league?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {statEntry.league?.country || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Match Statistics */}
                <div>
                  <h4 className="font-bold mb-2 border-b pb-1">
                    Match Statistics
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Position:</strong>{" "}
                      {statEntry.games?.position || "N/A"}
                    </p>
                    <p>
                      <strong>Appearances:</strong>{" "}
                      {statEntry.games?.appearences || 0}
                    </p>
                    <p>
                      <strong>Lineups:</strong> {statEntry.games?.lineups || 0}
                    </p>
                    <p>
                      <strong>Minutes Played:</strong>{" "}
                      {statEntry.games?.minutes || 0}
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      {statEntry.games?.rating || "N/A"}
                    </p>
                    <p>
                      <strong>Captain:</strong>{" "}
                      {statEntry.games?.captain ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Goal & Performance Metrics */}
                <div>
                  <h4 className="font-bold mb-2 border-b pb-1">
                    Performance & Goals
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <strong>Total Goals:</strong>{" "}
                      {statEntry.goals?.total || 0}
                    </p>
                    <p>
                      <strong>Assists:</strong> {statEntry.goals?.assists || 0}
                    </p>
                    <p>
                      <strong>Total Passes:</strong>{" "}
                      {statEntry.passes?.total || 0}
                    </p>
                    <p>
                      <strong>Key Passes:</strong> {statEntry.passes?.key || 0}
                    </p>
                    <p>
                      <strong>Pass Accuracy:</strong>{" "}
                      {`${statEntry.passes?.accuracy || 0}%`}
                    </p>
                  </div>
                </div>

                {/* Disciplinary Record */}
                <div className="md:col-span-3 grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-bold mb-2 border-b pb-1">Cards</h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Yellow Cards:</strong>{" "}
                        {statEntry.cards?.yellow || 0}
                      </p>
                      <p>
                        <strong>Yellow-Red Cards:</strong>{" "}
                        {statEntry.cards?.yellowred || 0}
                      </p>
                      <p>
                        <strong>Red Cards:</strong> {statEntry.cards?.red || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 border-b pb-1">Dribbles</h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Dribble Attempts:</strong>{" "}
                        {statEntry.dribbles?.attempts || 0}
                      </p>
                      <p>
                        <strong>Successful Dribbles:</strong>{" "}
                        {statEntry.dribbles?.success || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 border-b pb-1">Fouls</h4>
                    <div className="space-y-2">
                      <p>
                        <strong>Fouls Drawn:</strong>{" "}
                        {statEntry.fouls?.drawn || 0}
                      </p>
                      <p>
                        <strong>Fouls Committed:</strong>{" "}
                        {statEntry.fouls?.committed || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStatisticsDetail;
