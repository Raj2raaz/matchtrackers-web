import React, { useState, useEffect, useRef } from "react";
import { getFixtures } from "../../api/Football";
import { useNavigate } from "react-router-dom";

export default function Highlights() {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMatches = async () => {
      try {
        const matches = await getFixtures();
        setMatches(matches);
        cardRefs.current = matches.map((_, i) => cardRefs.current[i] || React.createRef());
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    getMatches();
  }, []);

  useEffect(() => {
    if (matches?.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % matches?.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [matches]);

  useEffect(() => {
    if (
      scrollContainerRef.current &&
      matches?.length > 0 &&
      cardRefs.current[currentIndex]
    ) {
      const currentCard = cardRefs.current[currentIndex].current;
      if (currentCard) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const cardRect = currentCard.getBoundingClientRect();
        const scrollPosition =
          cardRect.left -
          containerRect.left -
          (containerRect.width / 2 - cardRect.width / 2) +
          scrollContainerRef.current.scrollLeft;
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex, matches]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? matches?.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % matches?.length);
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    if (status.short === "1H" || status.short === "2H") return "bg-red-500";
    else if (status.short === "HT") return "bg-orange-500";
    else if (status.short === "FT") return "bg-blue-500";
    else if (status.short === "NS") return "bg-green-500";
    return "bg-gray-500";
  };

  return (
    <div className="relative w-full mt-0">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />

      {/* Navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg p-3 z-20 hover:bg-white dark:hover:bg-gray-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-600"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg p-3 z-20 hover:bg-white dark:hover:bg-gray-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-600"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Match cards container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 py-4 px-8 no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {matches?.length > 0 ? (
          matches.map((match, i) => (
            <div
              key={i}
              ref={cardRefs.current[i]}
              onClick={() => navigate("/football/match/" + match?.fixture.id)}
              className={`flex-shrink-0 w-72 hover:scale-105 cursor-pointer md:w-96 rounded-xl overflow-hidden shadow-lg border snap-center transition-all duration-300
                ${
                  currentIndex === i
                    ? "border-blue-500 scale-100"
                    : "border-blue-400 scale-95"
                } 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            >
              {/* Match header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src={match.league.logo}
                        alt={match.league.name}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <span className="text-sm font-semibold truncate max-w-32 md:max-w-40">
                      {match.league.name}
                    </span>
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    {match.fixture.venue?.city || match.league.country}
                  </div>
                </div>

                <div className="text-xs items-center flex justify-between mt-1 font-medium opacity-90">
                  <p>{formatMatchDate(match.fixture.date)}</p>
                  <p>
                    {match.score.halftime.home !== null &&
                      match.score.halftime.away !== null && (
                        <div className="flex justify-center">
                          <div className="text-white">
                            <span className="text-xs">
                              HT: {match.score.halftime.home} -{" "}
                              {match.score.halftime.away}
                            </span>
                          </div>
                        </div>
                      )}
                  </p>
                </div>
              </div>

              {/* Match status */}
              <div className="flex justify-center -mt-3">
                <div
                  className={`${getStatusColor(
                    match.fixture.status
                  )} text-white text-xs font-bold px-4 py-1 rounded-full shadow-md`}
                >
                  {match.fixture.status.long}
                </div>
              </div>

              {/* Teams and score */}
              <div className="px-4 py-3">
                <div className="flex gap-3 items-center justify-between mb-2">
                  <div className="flex items-center gap-2 md:gap-3 w-2/5">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-xs md:text-sm">
                      {match.teams.home.name}
                    </span>
                  </div>

                  <div className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md">
                    {match.goals.home !== null && match.goals.away !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{match.goals.home}</span>
                        <span className="text-sm text-white">|</span>
                        <span className="text-xl font-bold">{match.goals.away}</span>
                      </div>
                    ) : (
                      <div className="text-lg font-medium text-gray-300 dark:text-gray-400">
                        vs
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 md:gap-3 w-2/5">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-xs md:text-sm text-right">
                      {match.teams.away.name}
                    </span>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center p-1 overflow-hidden">
                      <img
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md text-gray-500 dark:text-gray-300">
            <div className="animate-pulse flex justify-center">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="mt-2">Loading matches...</div>
          </div>
        )}
      </div>
    </div>
  );
}
