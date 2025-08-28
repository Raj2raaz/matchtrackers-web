import React, { useState, useRef, useEffect, useCallback } from "react";

export default function YtShorts({ shorts }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const totalVideos = shorts.length;

  const createCircularArray = () => {
    return [shorts[totalVideos - 1], ...shorts, shorts[0]];
  };
  const circularVideos = createCircularArray();

  const getVideoId = (url) => {
    if (url.includes("/shorts/")) {
      return url.split("/shorts/")[1];
    }
    return url.split("v=")[1];
  };

  const scrollToIndex = useCallback((index, smooth = true) => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      isScrollingRef.current = true;

      const container = scrollContainerRef.current;
      const slideWidth =
        container.querySelector(".slide-item")?.offsetWidth || 280;
      const gap = 16;

      const adjustedIndex = index + 1;
      const containerWidth = container.offsetWidth;
      const slideCenter = adjustedIndex * (slideWidth + gap) + slideWidth / 2;
      const scrollLeft = slideCenter - containerWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: smooth ? "smooth" : "auto",
      });

      setCurrentSlide(index);

      setTimeout(
        () => {
          isScrollingRef.current = false;
        },
        smooth ? 500 : 100
      );
    }
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = (currentSlide + 1) % totalVideos;
    scrollToIndex(nextIndex);
  }, [currentSlide, totalVideos, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentSlide - 1 + totalVideos) % totalVideos;
    scrollToIndex(prevIndex);
  }, [currentSlide, totalVideos, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const slideElements = container.querySelectorAll(".slide-item");
        const slideWidth = slideElements[0]?.offsetWidth || 280;

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

        const adjustedIndex = closestIndex - 1;
        const normalizedIndex =
          ((adjustedIndex % totalVideos) + totalVideos) % totalVideos;

        if (normalizedIndex !== currentSlide && !isScrollingRef.current) {
          setCurrentSlide(normalizedIndex);
        }
      }
    }, 100);
  }, [currentSlide, totalVideos]);

  const startAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    autoScrollTimeoutRef.current = setTimeout(() => {
      if (!isScrollingRef.current) {
        handleNext();
        startAutoScroll();
      }
    }, 10000);
  }, [handleNext]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const timer = setTimeout(() => {
        scrollToIndex(0, false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollToIndex]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [startAutoScroll]);

  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current)
        clearTimeout(autoScrollTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 border border-slate-300 dark:border-slate-600 h-full max-h-[500px] sm:max-h-[550px] md:max-h-[800px] rounded-xl">
      <div className="bg-blue-600 px-6 py-3 border-b border-blue-700 rounded-t-lg">
        <h1 className="text-lg sm:text-xl font-semibold text-white">
          Web Stories
        </h1>
      </div>
      <div className="relative mt-2 px-6 py-2 ">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent z-10"></div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex py-2 px-12 no-scrollbar"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
        >
          {circularVideos.map((url, i) => {
            const originalIndex =
              i === 0 ? totalVideos - 1 : i === totalVideos + 1 ? 0 : i - 1;
            const videoId = getVideoId(url);

            return (
              <div
                key={`${i}-${originalIndex}`}
                className={`slide-item flex-shrink-0 w-full max-w-[150px] sm:max-w-[220px] md:max-w-[280px] aspect-[9/16] mx-1 sm:mx-2 transition-all duration-300 ease-in-out ${
                  originalIndex === currentSlide
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-90"
                }`}
                style={{ scrollSnapAlign: "center" }}
              >
                <iframe
                  key={`video-${videoId}`}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`}
                  title="YouTube Short"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; fullscreen; accelerometer; clipboard-write; gyroscope; picture-in-picture"
                  className="w-full h-full rounded-lg shadow-md"
                />
              </div>
            );
          })}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-gray-200 dark:from-gray-800 to-transparent z-10"></div>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md z-20 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Previous video"
        >
          <svg
            className="h-5 w-5 text-gray-900 dark:text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md z-20 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Next video"
        >
          <svg
            className="h-5 w-5 text-gray-900 dark:text-gray-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      <div className="mt-4 flex justify-center space-x-2 py-1">
        {shorts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollToIndex(index);
              if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
              }
              startAutoScroll();
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-blue-600"
                : "w-2 bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
