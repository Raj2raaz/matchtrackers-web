import React from "react";
import {
  Award,
  TrendingUp,
  Trophy,
  UserX,
  Users,
  Zap,
  BarChart,
  Star,
  Circle,
} from "lucide-react";

// Example data for two teams
const team1 = {
  teamId: 59,
  teamName: "RCB",
  teamColor: "#FF0000",
  matchesPlayed: 10,
  matchesWon: 7,
  matchesLost: 3,
  points: 14,
  nrr: "+0.521",
};

const team2 = {
  teamId: 60,
  teamName: "CSK",
  teamColor: "#FDB913",
  matchesPlayed: 10,
  matchesWon: 6,
  matchesLost: 4,
  points: 12,
  nrr: "+0.235",
};

export default function TeamComparisonCard({ team1, team2 }) {
  const getWinnerStyle = (val1, val2) => {
    if (val1 > val2) return "text-green-500";
    if (val1 < val2) return "text-red-500";
    return "text-gray-700";
  };

  const StatItem = ({ label, team1Value, team2Value, icon }) => (
    <div className="flex items-center justify-between w-full my-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
      <div className="flex-1 text-right pr-4">
        <span
          className={`font-bold text-lg ${getWinnerStyle(
            team1Value,
            team2Value
          )}`}
        >
          {team1Value}
        </span>
      </div>
      <div className="px-4 text-gray-600 text-sm font-medium flex items-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
      <div className="flex-1 pl-4">
        <span
          className={`font-bold text-lg ${getWinnerStyle(
            team2Value,
            team1Value
          )}`}
        >
          {team2Value}
        </span>
      </div>
    </div>
  );

  const TeamHeader = ({ team, isLeft }) => {
    const alignClass = isLeft ? "text-right" : "text-left";
    const flexDir = isLeft ? "flex-row-reverse" : "flex-row";

    return (
      <div className={`w-full ${alignClass}`}>
        <div className={`flex items-center ${flexDir} mb-1`}>
          <div
            style={{ backgroundColor: team.teamColor || "#CBD5E0" }}
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-2 shadow-md border-2 border-white`}
          >
            <span className="font-bold text-xl text-white">
              {team.teamName.substring(0, 1)}
            </span>
          </div>
          <h3 className="text-xl font-bold">{team.teamName}</h3>
        </div>
        <div className={`flex ${flexDir} items-center text-sm mb-4`}>
          <div className="flex items-center mx-2 bg-blue-100 px-3 py-1 rounded-full text-blue-600">
            <TrendingUp size={14} className="mr-1" />
            <span className="font-medium">{team.nrr}</span>
          </div>
        </div>
      </div>
    );
  };

  const getScoreStatus = () => {
    if (team1.points > team2.points) {
      return (
        <div className="text-center text-sm font-medium text-green-600 mb-4">
          <Trophy size={16} className="inline mr-1" />
          {team1.teamName} leads by {team1.points - team2.points} points
        </div>
      );
    } else if (team1.points < team2.points) {
      return (
        <div className="text-center text-sm font-medium text-green-600 mb-4">
          <Trophy size={16} className="inline mr-1" />
          {team2.teamName} leads by {team2.points - team1.points} points
        </div>
      );
    } else {
      return (
        <div className="text-center text-sm font-medium text-orange-600 mb-4">
          <Circle size={16} className="inline mr-1" />
          Teams are tied on points
        </div>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-4 rounded-t-xl shadow-md mb-6">
        <h2 className="text-center font-bold text-xl flex items-center justify-center">
          <Trophy size={20} className="mr-2" />
          Team Comparison
          <Trophy size={20} className="ml-2" />
        </h2>
      </div>

      {getScoreStatus()}

      <div className="flex justify-between">
        <div className="w-5/12">
          <TeamHeader team={team1} isLeft={true} />
        </div>
        <div className="w-2/12 flex justify-center items-center">
          <div className="h-20 w-px bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div className="w-5/12">
          <TeamHeader team={team2} isLeft={false} />
        </div>
      </div>

      <div className="border-t border-b border-gray-200 dark:border-gray-700">
        <StatItem
          label="Matches Played"
          team1Value={team1.matchesPlayed}
          team2Value={team2.matchesPlayed}
          icon={<Users size={16} className="text-blue-500" />}
        />
        <StatItem
          label="Matches Won"
          team1Value={team1.matchesWon}
          team2Value={team2.matchesWon}
          icon={<Trophy size={16} className="text-green-500" />}
        />
        <StatItem
          label="Matches Lost"
          team1Value={team1.matchesLost}
          team2Value={team2.matchesLost}
          icon={<UserX size={16} className="text-red-500" />}
        />
        <StatItem
          label="Net Run Rate"
          team1Value={team1.nrr}
          team2Value={team2.nrr}
          icon={<BarChart size={16} className="text-purple-500" />}
        />
      </div>
    </div>
  );
}
