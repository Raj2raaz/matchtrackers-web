import React, { useState, useEffect } from "react";
import Image from "../Image";
import { useNavigate } from "react-router-dom";
import { getRankings } from "../../api/Home";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { GiCricketBat as Bat } from "react-icons/gi";
import { BiSolidCricketBall as Zap } from "react-icons/bi";

export default function PlayerRankings() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("batsmen");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerRankings, setPlayerRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const categories = [
    { id: "batsmen", icon: Bat, label: "Batsmen" },
    { id: "bowlers", icon: Zap, label: "Bowlers" },
    { id: "allrounders", icon: Star, label: "All-rounders" },
    { id: "teams", icon: Trophy, label: "Teams" },
  ];

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const rankings = await getRankings(activeCategory, "t20");
        setPlayerRankings(rankings || []);
        setCurrentPlayerIndex(0);
      } catch (error) {
        console.error("Error fetching rankings:", error);
        setPlayerRankings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [activeCategory]);

  useEffect(() => {
    if (playerRankings.length <= 1) return;
    const interval = setInterval(() => handleSlideChange("next"), 4000);
    return () => clearInterval(interval);
  }, [playerRankings.length]);

  const handleSlideChange = (direction) => {
    if (isTransitioning || playerRankings.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPlayerIndex((prev) =>
        direction === "next"
          ? (prev + 1) % playerRankings.length
          : prev === 0
          ? playerRankings.length - 1
          : prev - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const currentCategory = categories.find((cat) => cat.id === activeCategory);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow p-3 sm:p-4 w-full max-w-sm mx-auto transition-colors duration-300">
      {/* Title */}
      <div className="mb-3">
        <h1 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100">
          Player Rankings
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          Top trending players
        </p>
      </div>

      {/* Category buttons */}
      <div className="flex flex-wrap gap-1 mb-3 bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 p-2 cursor-pointer rounded-md text-xs sm:text-sm transition-all duration-200 flex items-center justify-center ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={category.label}
            >
              <IconComponent className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Player slider */}
      <div className="relative h-48 sm:h-36 mb-3 overflow-hidden rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <div className="w-full h-full relative overflow-hidden flex justify-center items-center">
              {playerRankings.map((player, index) => {
                const offset = (index - currentPlayerIndex) * 100;
                const scale = index === currentPlayerIndex ? 1 : 0.9;
                const zIndex = index === currentPlayerIndex ? 10 : 5;
                const opacity =
                  Math.abs(index - currentPlayerIndex) <= 1 ? 1 : 0;

                return (
                  <div
                    key={player?.id}
                    className="absolute transition-all duration-500 ease-in-out w-full px-2"
                    style={{
                      transform: `translateX(${offset}%) scale(${scale})`,
                      zIndex,
                      opacity,
                    }}
                  >
                    <div
                      onClick={() =>
                        navigate("/cricket/player/" + player?.id)
                      }
                      className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-900 h-full rounded-xl border border-gray-200 dark:border-gray-700 p-2 sm:p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md transition duration-200"
                    >
                      <div className="mb-2 sm:mb-0 sm:mr-3 flex-shrink-0 pl-3">
                        <div className="relative">
                          <Image
                            className="h-12 w-12 sm:h-14 sm:w-14 aspect-square rounded-full border-2 border-blue-100 dark:border-blue-800 shadow"
                            faceImageId={player?.faceImageId}
                          />
                          <div className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-900 absolute -top-1 -right-1">
                            {player?.rank}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">
                          {player?.name}
                        </h3>
                        <div className="flex justify-center sm:justify-start items-center gap-1 text-xs mt-1">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300 font-semibold">
                            {player?.points}
                          </span>
                        </div>
                        <div className="flex justify-center sm:justify-start items-center gap-1 mt-1">
                          {currentCategory && (
                            <>
                              <currentCategory.icon className="w-3 h-3 text-blue-600" />
                              <span className="text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                                {currentCategory.label}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation arrows */}
            {playerRankings.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideChange("prev");
                  }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideChange("next");
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}

            {/* Slider dots */}
            {playerRankings.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {playerRankings.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentPlayerIndex
                        ? "bg-blue-600 w-5"
                        : "bg-gray-300 dark:bg-gray-600 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* View all button */}
      <button
        onClick={() =>
          navigate(`/cricket/rankings/${activeCategory}/t20`)
        }
        className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-sm py-2 px-3 text-white w-full flex items-center justify-center gap-1.5 shadow hover:shadow-md"
      >
        <span>View All {currentCategory?.label}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
