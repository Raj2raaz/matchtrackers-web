import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogSection(props) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const blog = Array.isArray(props.blog) ? props.blog : [];
  const blogsToShow = [...blog, ...blog];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex >= blog.length) {
      const timeout = setTimeout(() => {
        if (!sliderRef.current) return;
        sliderRef.current.style.transition = "none";
        setCurrentIndex(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            sliderRef.current.style.transition = "transform 0.5s ease-in-out";
          });
        });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, blog.length]);

  if (!blog || blog.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 flex-1 my-5 border w-fit border-slate-300 dark:border-slate-600 rounded-xl p-5">
        <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Blogs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No blogs available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 flex-1 my-5 border border-slate-300 dark:border-slate-600 rounded-xl p-3 md:p-5 overflow-hidden">
      <div className="mb-4">
        <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Blogs
        </h1>
        <p className="text-sm text-gray-800 dark:text-gray-300">
          Match reviews, player interviews, and expert cricket takes — curated
          for the fans who want more
        </p>
      </div>

      <div className="relative w-full h-40 md:h-60 overflow-hidden rounded-xl">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out h-full min-w-0"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {blogsToShow.map((blogItem, index) => (
            <div
              key={index}
              className="w-full md:w-1/2 h-full flex-shrink-0 relative px-1"
            >
              <div className="w-full h-full relative rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={blogItem?.featuredImage}
                  alt={blogItem?.title || `Blog ${index + 1}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {blogItem?.title && (
                  <div className="absolute bottom-4 left-2 right-2">
                    <h3 className="text-white font-semibold text-xs md:text-sm line-clamp-2">
                      {blogItem.title}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? blog.length - 1 : prev - 1
            )
          }
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full p-1 md:p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === blog.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full p-1 md:p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
        >
          <ChevronRight size={16} />
        </button>

        {/* Explore Blogs Button */}
        <button
          onClick={() => navigate("/cricket/blogs")}
          className="absolute bottom-2 right-2 md:right-4 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200 shadow-lg z-10"
        >
          Explore Blogs
        </button>
      </div>
    </div>
  );
}
