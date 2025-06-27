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

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-200 w-[680px] flex-1 my-5 border border-slate-300 rounded-xl p-5">
      <h1 className="font-bold text-lg">Historic Moments</h1>
      {/* <p className="text-sm">On This Day in Cricket History.</p> */}

      <div className="relative mt-2 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        <div className="flex space-x-2">
          {images.map((src, index) => (
            <div
              key={index}
              className="snap-start flex-shrink-0 w-[320px] relative"
            >
              <img
                src={src}
                alt={`Historic Moment ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
