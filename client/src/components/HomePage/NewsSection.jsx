import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import Image from "../Image";
import { useNavigate } from "react-router-dom";

export default function NewsSection({ news = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const navigate = useNavigate();

  // Handle responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3); // Desktop: 3 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // Tablet: 2 items
      } else {
        setItemsPerView(1); // Mobile: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const displayNews = news.slice(0, 12).filter((item) => item?.story);
  const maxSlide = Math.max(0, displayNews.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && displayNews.length > itemsPerView) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev >= maxSlide) {
            return 0; // Loop back to start
          }
          return prev + 1; // Move one item at a time
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, displayNews.length, itemsPerView, maxSlide]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return maxSlide; // Go to last possible position
      }
      return prev - 1; // Move one item back
    });
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => {
      if (prev >= maxSlide) {
        return 0; // Loop back to start
      }
      return prev + 1; // Move one item forward
    });
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide));
    setIsAutoPlaying(false);
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp || Date.now())).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const navigateToNews = (newsId) => {
    navigate(`/cricket/news/${newsId}`);
    // Replace with your actual navigation logic
  };

  const navigateToAllNews = () => {
    navigate("/cricket/all-news");
    // Replace with your actual navigation logic
  };

  if (!news || news.length === 0) {
    return (
      <div className="bg-gray-200 mx-2 sm:mx-5 md:mx-24 flex-1 mb-5 border border-slate-300 rounded-xl p-4 sm:p-5">
        <h1 className="text-xl font-bold text-primary">LATEST NEWS</h1>
        <p className="text-gray-500 italic mt-4">No news available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 border rounded-xl border-slate-300 mx-2 sm:mx-5 md:mx-24 flex-1 mb-5  overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6  border-b border-gray-100 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            LATEST NEWS
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with cricket news
          </p>
        </div>
        <button
          onClick={navigateToAllNews}
          className="flex cursor-pointer items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors self-start sm:self-auto"
        >
          See All <ExternalLink size={14} />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Featured Stories Slider */}
        <div className="relative mb-6">
          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentSlide * 100) / itemsPerView
                }%)`,
              }}
            >
              {displayNews.map((newsItem, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 group cursor-pointer"
                  style={{ width: `${100 / itemsPerView}%` }}
                  onClick={() => navigateToNews(newsItem.story.id)}
                >
                  <div className="mx-1 sm:mx-2">
                    <div className="relative h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        faceImageId={newsItem.story.imageId}
                        className="w-full h-full object-cover"
                        resolution="de"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 text-xs sm:text-sm">
                          <Clock size={12} className="sm:w-4 sm:h-4" />
                          <span className="truncate">
                            {newsItem.story.coverImage?.source ||
                              "Cricket News"}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline text-xs">
                            {formatDate(newsItem.story.pubTime)}
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-lg lg:text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                          {newsItem.story.hline}
                        </h2>
                        <p className="text-gray-200 line-clamp-2 text-xs sm:text-sm leading-relaxed hidden sm:block">
                          {newsItem.story.intro}
                        </p>
                      </div>

                      {/* Mobile date display */}
                      <div className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded-lg sm:hidden">
                        <span className="text-white text-xs">
                          {formatDate(newsItem.story.pubTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Only show if there are more items than visible */}
            {displayNews.length > itemsPerView && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={currentSlide === 0}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm"
                  aria-label="Previous news"
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={currentSlide >= maxSlide}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm"
                  aria-label="Next news"
                >
                  <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>

          {/* Slide Indicators */}
          {displayNews.length > itemsPerView && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-blue-600 w-6 sm:w-8"
                      : "bg-gray-300 hover:bg-gray-400 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* News Strip/Bar */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Recent Updates
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {displayNews.slice(0, 6).map((newsItem, index) => (
              <div
                key={index}
                onClick={() => navigateToNews(newsItem.story.id)}
                className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all group border border-transparent hover:border-blue-100"
              >
                <Image
                  faceImageId={newsItem.story.imageId}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
                  resolution="de"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
                    {newsItem.story.hline}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="truncate">
                      {newsItem.story.coverImage?.source || "Cricket News"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                      {formatDate(newsItem.story.pubTime)}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 sm:w-4 sm:h-4"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
