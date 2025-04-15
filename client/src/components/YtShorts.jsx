import React, { useState, useRef, useEffect } from "react";
import data from "../data.json";

// Thumbnail imports
import t1 from "../assets/ytThumbnails/1.jpg";
import t2 from "../assets/ytThumbnails/2.jpg";
import t3 from "../assets/ytThumbnails/3.jpg";
import t4 from "../assets/ytThumbnails/4.jpg";
import t5 from "../assets/ytThumbnails/5.jpg";
import t6 from "../assets/ytThumbnails/6.jpg";
import t7 from "../assets/ytThumbnails/7.jpg";
import t8 from "../assets/ytThumbnails/8.jpg";
import t9 from "../assets/ytThumbnails/9.jpg";
import t10 from "../assets/ytThumbnails/10.jpg";

export default function YtShorts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const scrollContainerRef = useRef(null);

  // Map thumbnails to their imports
  const thumbnails = {
    1: t1,
    2: t2,
    3: t3,
    4: t4,
    5: t5,
    6: t6,
    7: t7,
    8: t8,
    9: t9,
    10: t10,
  };

  const videos = data.youtube;
  const totalVideos = videos.length;

  // Create a circular array for display
  const createCircularArray = () => {
    // Add last item to beginning and first item to end
    return [videos[totalVideos - 1], ...videos, videos[0]];
  };

  const circularVideos = createCircularArray();

  const getVideoId = (url) => {
    if (url.includes("/shorts/")) {
      return url.split("/shorts/")[1];
    }
    return url.split("v=")[1];
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.querySelector(".slide-item").offsetWidth;
      const gap = 16; // Gap between slides in pixels

      // Adjust for the extra item at the beginning
      const adjustedIndex = index + 1;

      // Calculate center position to ensure the selected slide is centered
      const containerWidth = container.offsetWidth;
      const slideCenter = adjustedIndex * (slideWidth + gap) + slideWidth / 2;
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

  const handleThumbnailClick = (index) => {
    // Convert from circular index to original index
    const adjustedIndex =
      index === 0 ? totalVideos - 1 : index === totalVideos + 1 ? 0 : index - 1;

    setActiveVideo(adjustedIndex);
    setCurrentSlide(adjustedIndex);
  };

  // Handle scroll events to update pagination
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const slideElements = container.querySelectorAll(".slide-item");
        const slideWidth = slideElements[0]?.offsetWidth || 0;
        const gap = 16;

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

        // Adjust for the circular array (first visible item is actually the last one)
        const adjustedIndex = closestIndex - 1;
        const normalizedIndex =
          ((adjustedIndex % totalVideos) + totalVideos) % totalVideos;

        if (normalizedIndex !== currentSlide) {
          setCurrentSlide(normalizedIndex);
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentSlide, totalVideos]);

  // Handle special scroll behavior for the circular effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      const slideElements = container.querySelectorAll(".slide-item");
      const slideWidth = slideElements[0]?.offsetWidth || 0;
      const gap = 16;

      // Check if we've scrolled to the fake first or last item
      if (currentSlide === totalVideos - 1 && activeVideo !== totalVideos - 1) {
        // We're at the "fake" last item, jump to the real last item
        setTimeout(() => {
          container.scrollTo({
            left: totalVideos * (slideWidth + gap),
            behavior: "auto",
          });
        }, 300);
      } else if (currentSlide === 0 && activeVideo !== 0) {
        // We're at the "fake" first item, jump to the real first item
        setTimeout(() => {
          container.scrollTo({
            left: slideWidth + gap,
            behavior: "auto",
          });
        }, 300);
      }
    };

    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [currentSlide, activeVideo, totalVideos]);

  // Set initial scroll position
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Set initial position to the first actual item (not the duplicated one)
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const slideElements = container.querySelectorAll(".slide-item");
        const slideWidth = slideElements[0]?.offsetWidth || 0;
        const gap = 16;

        container.scrollTo({
          left: slideWidth + gap,
          behavior: "auto",
        });
      }, 100);
    }
  }, []);

  // Get the correct thumbnail for a video
  const getThumbnail = (index) => {
    // Convert to 1-based index for thumbnail mapping
    const thumbnailIndex =
      (((index % totalVideos) + totalVideos) % totalVideos) + 1;
    return thumbnails[thumbnailIndex] || null;
  };

  return (
    <div className="bg-white shadow-lg px-6 py-4 rounded-lg">
      <h1 className="text-xl font-semibold">Web Stories</h1>
      <div className="relative mt-2">
        {/* Left fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10"></div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex py-2 px-12 no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {circularVideos.map((url, i) => {
            // Convert from circular index to original index
            const originalIndex =
              i === 0 ? totalVideos - 1 : i === totalVideos + 1 ? 0 : i - 1;

            const isActive = activeVideo === originalIndex;
            const videoId = getVideoId(url);

            return (
              <div
                key={i}
                className={`slide-item flex-shrink-0 w-full max-w-[225px] aspect-[9/16] mx-2 transition-all duration-300 ${
                  originalIndex === currentSlide
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-90"
                }`}
                style={{ scrollSnapAlign: "center" }}
              >
                {isActive ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube Short"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg shadow-md"
                  ></iframe>
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer"
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <img
                      src={getThumbnail(originalIndex)}
                      alt={`YouTube Short ${originalIndex + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollToIndex(index);
              setActiveVideo(null); // Reset active video when navigating with dots
            }}
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
