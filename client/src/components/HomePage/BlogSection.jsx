import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogSection({ blog = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation - move by 1 slide
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blog.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blog.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle dot navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!blog || blog.length === 0) {
    return (
      <div className="bg-gray-200 flex-1 my-5 border w-fit border-slate-300 rounded-xl p-5">
        <h1 className="font-bold text-lg">Blogs</h1>
        <p className="text-sm text-gray-500">No blogs available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-200 flex-1 my-5 border border-slate-300 rounded-xl p-5 overflow-hidden ">
        <div className="mb-4">
          <h1 className="font-bold text-lg">Blogs</h1>
          <p className="text-sm text-gray-800">
            Match reviews, player interviews, and expert cricket takes — curated
            for the fans who want more
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Main Slider */}
          <div className="relative w-full h-60 overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 50}%)` }}
            >
              {blog.map((blogItem, index) => (
                <div
                  key={index}
                  className="w-1/2 h-full flex-shrink-0 relative px-1"
                >
                  <div className="w-full h-full relative rounded-lg overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={blogItem?.featuredImage}
                      alt={blogItem?.title || `Blog ${index + 1}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {blogItem?.title && (
                      <div className="absolute bottom-4 left-2 right-2">
                        <h3 className="text-white font-semibold text-xs line-clamp-2">
                          {blogItem.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
              aria-label="Previous blog"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
              aria-label="Next blog"
            >
              <ChevronRight size={18} />
            </button>

            {/* Explore Blogs Button */}
            <button
              onClick={() => {
                // Replace with your navigation logic
                console.log("Navigate to /cricket/blogs");
              }}
              className="absolute bottom-2 right-4 px-3 py-1.5 cursor-pointer rounded-full bg-white text-blue-700 text-xs font-medium hover:bg-blue-50 transition-colors duration-200 shadow-lg z-10"
            >
              Explore Blogs
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {blog.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-600 w-6"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
