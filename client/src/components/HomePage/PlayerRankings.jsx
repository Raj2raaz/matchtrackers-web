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
  const [slideDirection, setSlideDirection] = useState(null);

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

    const interval = setInterval(() => {
      handleSlideChange("next");
    }, 4000);

    return () => clearInterval(interval);
  }, [playerRankings.length]);

  const handleSlideChange = (direction) => {
    if (isTransitioning || playerRankings.length <= 1) return;

    setIsTransitioning(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentPlayerIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % playerRankings.length;
        } else {
          return prevIndex === 0 ? playerRankings.length - 1 : prevIndex - 1;
        }
      });
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 300);
  };

  const currentPlayer = playerRankings[currentPlayerIndex];
  const currentCategory = categories.find((cat) => cat.id === activeCategory);

  return (
    <div className="bg-gray-200 border rounded-xl border-slate-300  shadow-lg p-4 w-96">
      <div className="mb-3">
        <h1 className="font-bold text-xl text-gray-800">Player Rankings</h1>
        <p className="text-sm text-gray-600 mt-0.5">Top trending players</p>
      </div>

      <div className="flex gap-1 mb-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-1 p-2 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
              title={category.label}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <div className="relative h-36 mb-3 overflow-hidden rounded-xl">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
              <p className="text-sm text-gray-500">Loading rankings...</p>
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
                    className={`absolute transition-all duration-500 ease-in-out w-full px-2`}
                    style={{
                      transform: `translateX(${offset}%) scale(${scale})`,
                      zIndex: zIndex,
                      opacity: opacity,
                    }}
                  >
                    <div
                      onClick={() => navigate("/cricket/player/" + player?.id)}
                      className="flex items-center bg-white h-full rounded-xl border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-200 shadow-sm min-h-[128px]"
                    >
                      <div className="mr-3 flex-shrink-0">
                        <div className="relative">
                          <Image
                            className="h-14 w-14 aspect-square rounded-full border-2 border-blue-100 shadow-md"
                            faceImageId={player?.faceImageId}
                          />
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white transform -translate-y-1 translate-x-1 ml-auto">
                            {player?.rank}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate mb-1.5 text-gray-800">
                          {player?.name}
                        </h3>

                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-700">
                              {player?.points}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {currentCategory && (
                            <>
                              <currentCategory.icon className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-blue-700 font-medium capitalize bg-blue-50 px-1.5 py-0.5 rounded-full">
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

            {playerRankings.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideChange("prev");
                  }}
                  className="absolute left-2 top-1/2 cursor-pointer -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-1.5 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideChange("next");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-20 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-1.5 shadow-md transition-all duration-200 hover:bg-white hover:shadow-lg hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </>
            )}

            {playerRankings.length > 1 && (
              <div className="absolute bottom-4 z-20 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {playerRankings.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      index === currentPlayerIndex
                        ? "bg-blue-600 w-6"
                        : "bg-gray-300 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/cricket/rankings/${activeCategory}/t20`)}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold text-sm py-2.5 px-4 text-white w-full transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <span>View All {currentCategory?.label}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
