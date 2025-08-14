import React, { useState, useEffect } from "react";
// Import your images
import webstories from "../assets/Landing/webstories.webp";
import webstories1 from "../assets/Landing/webstories1.webp";

export default function HistoricMoments() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [webstories, webstories1 /* Add more images here */];

  useEffect(() => {
    const container = document.querySelector(".overflow-x-auto");
    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / container.clientWidth);
      setCurrentImageIndex(index);
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 w-full max-w-[680px] flex-1 my-5 border border-slate-300 dark:border-slate-600 rounded-xl p-4 sm:p-5">
      <h1 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">
        Historic Moments
      </h1>

      <div className="relative mt-2 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        <div className="flex space-x-4">
          {images.map((src, index) => (
            <div
              key={index}
              className="snap-start flex-shrink-0 w-[80%] sm:w-[320px] relative"
            >
              <img
                src={src}
                alt={`Historic Moment ${index + 1}`}
                className="w-full h-48 sm:h-56 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
