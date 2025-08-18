import React from "react";
import {
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Shield,
  Layers,
  Clock,
  BarChart3,
  Star,
  CircleSlash2,
} from "lucide-react";

export default function VenueStats({ venueData }) {
  // Function to get the appropriate icon for each stat type
  const getIconForStat = (key) => {
    switch (key) {
      case "Total Matches":
        return <Calendar className="text-blue-500" size={18} />;
      case "Matches won batting first":
        return <Target className="text-amber-500" size={18} />;
      case "Matches won bowling first":
        return <Shield className="text-green-500" size={18} />;
      case "Avg. scores recorded":
        return <BarChart3 className="text-purple-500" size={18} />;
      case "Highest total recorded":
        return <TrendingUp className="text-emerald-500" size={18} />;
      case "Lowest total recorded":
        return <TrendingDown className="text-red-500" size={18} />;
      case "Highest score chased":
        return <Award className="text-yellow-500" size={18} />;
      case "Lowest score defended":
        return <CircleSlash2 className="text-indigo-500" size={18} />;
      default:
        return <Layers className="text-gray-500" size={18} />;
    }
  };

  // Function to format multi-line values
  const formatValue = (value) => {
    if (value.includes("\n")) {
      return value.split("\n").map((line, index) => (
        <div key={index} className="text-sm">
          {line}
        </div>
      ));
    }
    return value;
  };

  const filteredStats = venueData.venueStats.filter(
    (stat) => stat.key !== "Avg. scores recorded"
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg mb-4 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden max-w-3xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center">
        <MapPin className="text-white mr-2" size={20} />
        <h2 className="text-lg font-bold text-white">Venue Statistics</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
        {filteredStats.map((stat, index) => (
          <div
            key={index}
            className="flex p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="mr-3 mt-1">{getIconForStat(stat.key)}</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.key}
              </h3>
              <div className="font-semibold text-gray-800 dark:text-gray-100 mt-1">
                {formatValue(stat.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
