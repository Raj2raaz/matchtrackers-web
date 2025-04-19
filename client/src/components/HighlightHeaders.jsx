import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import county from "../assets/headerMatches/county.jpg";
import hk from "../assets/headerMatches/hk.jpg";
import iccWomen from "../assets/headerMatches/iccWomen.jpg";
import ipl from "../assets/headerMatches/ipl.jpg";
import kartini from "../assets/headerMatches/kartini.jpg";
import psl from "../assets/headerMatches/psl.jpg";

export default function HighlightHeaders() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  // Images with their corresponding IDs and labels for navigation
  const imageData = [
    { src: psl, id: "9460", name: "PSL" },
    { src: kartini, id: "9560", name: "Kartini" },
    { src: ipl, id: "9237", name: "IPL" },
    { src: hk, id: "9647", name: "HK" },
    { src: county, id: "9369", name: "County" },
    { src: iccWomen, id: "9532", name: "ICC Women" },
    { src: psl, id: "9460", name: "PSL" },
    { src: kartini, id: "9560", name: "Kartini" },
    { src: ipl, id: "9237", name: "IPL" },
    { src: hk, id: "9647", name: "HK" },
    { src: county, id: "9369", name: "County" },
    { src: iccWomen, id: "9532", name: "ICC Women" },
    { src: psl, id: "9460", name: "PSL" },
    { src: kartini, id: "9560", name: "Kartini" },
    { src: ipl, id: "9237", name: "IPL" },
  ];

  // Calculate card width on component mount and window resize
  useEffect(() => {
    const calculateCardWidth = () => {
      if (scrollContainerRef.current) {
        const firstCard =
          scrollContainerRef.current.querySelector(".carousel-item");
        if (firstCard) {
          // Get full width including margins
          const style = window.getComputedStyle(firstCard);
          const width =
            firstCard.offsetWidth +
            parseInt(style.marginLeft) +
            parseInt(style.marginRight);
          setCardWidth(width);
        }
      }
    };

    calculateCardWidth();
    window.addEventListener("resize", calculateCardWidth);

    return () => window.removeEventListener("resize", calculateCardWidth);
  }, []);

  // Auto-scroll effect - move one card every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, cardWidth]);

  const scrollToCard = (index) => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const normalizedIndex = index % imageData.length;
      scrollContainerRef.current.scrollTo({
        left: normalizedIndex * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    setIsPaused(true);
    const newIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);

    // Resume auto-scroll after 5 seconds of inactivity
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % imageData.length;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  const handleImageClick = (id) => {
    navigate(`/schedules/${id}`);
  };

  // Pause auto-scroll when user interacts with the carousel
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Handle manual scroll
  const handleScroll = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex % imageData.length);
        setIsPaused(true);

        // Resume auto-scroll after 5 seconds of inactivity
        setTimeout(() => setIsPaused(false), 5000);
      }
    }
  };

  return (
    <div>
      <div
        className="relative top-7 px-4 md:px-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {/* Left Fade Effect */}
        <div className="absolute md:left-20 top-0 h-full w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide py-2 relative snap-x"
          onScroll={handleScroll}
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {imageData.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 carousel-item w-64 md:w-72 mx-2 cursor-pointer snap-center transition-transform duration-300 hover:scale-105"
              onClick={() => handleImageClick(item.id)}
            >
              <div className="relative h-26 md:h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <img
                  src={item.src}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading={index < 5 ? "eager" : "lazy"} // Optimize loading
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right Fade Effect */}
        <div className="absolute md:right-20 right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-24 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md z-20 transition-all"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          onClick={() => {
            setIsPaused(true);
            handleNext();
            setTimeout(() => setIsPaused(false), 5000);
          }}
          className="absolute right-4 md:right-24 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md z-20 transition-all"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
    </div>
  );
}
