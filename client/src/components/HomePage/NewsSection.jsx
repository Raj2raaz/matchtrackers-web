import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import Image from "../Image";
import { useNavigate } from "react-router-dom";

export default function BlogNewsSection({ blogs = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const displayBlogs = blogs.slice(0, 12).filter((item) => item?.title);
  const maxSlide = Math.max(0, displayBlogs.length - itemsPerView);

  useEffect(() => {
    if (isAutoPlaying && displayBlogs.length > itemsPerView) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, displayBlogs.length, itemsPerView, maxSlide]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide));
    setIsAutoPlaying(false);
  };

  const formatDate = (timestamp) =>
    new Date(timestamp || Date.now()).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 mx-2 sm:mx-5 md:mx-24 flex-1 mb-5 border border-slate-300 dark:border-slate-600 rounded-xl p-4 sm:p-5">
        <h1 className="text-xl font-bold text-primary dark:text-gray-100">
          NEWS
        </h1>
        <p className="text-gray-500 dark:text-gray-400 italic mt-4">
          No news available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 border rounded-xl border-slate-300 dark:border-slate-600 mx-2 sm:mx-5 md:mx-24 flex-1 mb-5 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Latest News
          </h1>
          {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Match reviews, player interviews, and expert takes
          </p> */}
        </div>
        {/* <button
          onClick={() => navigate("/cricket/blogs")}
          className="flex cursor-pointer items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors self-start sm:self-auto"
        >
          See All <ExternalLink size={14} />
        </button> */}
      </div>

      {/* Slider */}
      <div className="relative mb-6">
        <div className="relative overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(currentSlide * 100) / itemsPerView}%)`,
            }}
          >
            {displayBlogs.map((blogItem, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 group cursor-pointer"
                style={{ width: `${100 / itemsPerView}%` }}
                onClick={() => navigate(`/cricket/cricketblog/${blogItem.id}`)}
              >
                <div className="mx-1 sm:mx-2">
                  <div className="relative h-64 sm:h-72 lg:h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={blogItem.featuredImage}
                      alt={blogItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
                      <span className="text-xs sm:text-sm">
                        {formatDate(blogItem.publishedAt)}
                      </span>
                      <h2 className="text-sm sm:text-lg lg:text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {blogItem.title}
                      </h2>
                      <p className="text-gray-200 dark:text-gray-300 line-clamp-2 text-xs sm:text-sm leading-relaxed hidden sm:block">
                        {blogItem.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {displayBlogs.length > itemsPerView && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
