import React, { useState, useRef, useEffect } from "react";
import data from "../data.json";

export default function YtShorts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  const totalVideos = data.youtube.length;

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.querySelector(".slide-item").offsetWidth;
      const gap = 16; // 4rem converted to pixels

      // Calculate center position to ensure the selected slide is centered
      const containerWidth = container.offsetWidth;
      const slideCenter = index * (slideWidth + gap) + slideWidth / 2;
      const scrollLeft = slideCenter - containerWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentSlide + 1) % totalVideos;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentSlide - 1 + totalVideos) % totalVideos;
    scrollToIndex(prevIndex);
  };

  // Handle scroll events to update pagination
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const slideElements = container.querySelectorAll(".slide-item");
        const slideWidth = slideElements[0]?.offsetWidth || 0;
        const gap = 16; // 4rem gap in pixels

        // Calculate which slide is most centered in the viewport
        const containerCenter =
          container.scrollLeft + container.offsetWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        slideElements.forEach((slide, index) => {
          const slideCenter = slide.offsetLeft + slideWidth / 2;
          const distance = Math.abs(slideCenter - containerCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentSlide) {
          setCurrentSlide(closestIndex);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentSlide]);

  // Set initial scroll position to show a bit of the last and first items
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => scrollToIndex(0), 100);
    }
  }, []);

  // Create video array with duplicated items for looping effect
  const processedVideos = [...data.youtube];

  return (
    <div className="bg-white shadow-lg px-6 py-4 rounded-lg">
      <h1 className="text-xl font-semibold">Web Stories</h1>
      <div className="relative mt-2">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10"></div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex py-2 px-12 no-scrollbar "
          style={{ scrollSnapType: "x mandatory" }}
        >
          {processedVideos.map((e, i) => (
            <div
              key={i}
              className={`slide-item flex-shrink-0 w-full max-w-[225px] aspect-[9/16] mx-2 transition-all duration-300 ${
                i === currentSlide
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-90"
              }`}
              style={{ scrollSnapAlign: "center" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${e.split("/shorts/")[1]}`}
                title="YouTube Short"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-md"
              ></iframe>
            </div>
          ))}
        </div>

        {/* Right fade effect */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-20 hover:bg-gray-100"
          aria-label="Previous video"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-20 hover:bg-gray-100"
          aria-label="Next video"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex justify-center space-x-2">
        {processedVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
