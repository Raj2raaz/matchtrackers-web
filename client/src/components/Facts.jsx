import { useState, useRef, useEffect } from "react";
import facts1 from "../assets/facts1.jpg";
import facts2 from "../assets/facts2.jpg";
import facts3 from "../assets/facts3.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function InterestingFactsCarousel() {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1); // default to 1

  const facts = [
    {
      id: 1,
      image: facts1,
      title:
        "RIVAN PARAG TO LEAD RAJASTHAN ROYALS IN THE FIRST THREE GAMES, WITH SAMSON PLAYING AS A BATTER DUE TO A FINGER INJURY",
    },
    {
      id: 2,
      image: facts2,
      title: "MS DHONI BECOMES THE FIRST PLAYER TO FEATURE IN 250 IPL MATCHES",
    },
    {
      id: 3,
      image: facts3,
      title:
        "VIRAT KOHLI HOLDS THE RECORD FOR MOST RUNS IN A SINGLE IPL SEASON",
    },
  ];

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else {
        setCardsPerView(3);
      }
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Calculate card width dynamically
  const cardWidth = containerRef.current
    ? containerRef.current.offsetWidth / cardsPerView
    : 300; // fallback

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => {
    const maxIndex = facts.length - cardsPerView;
    const newIndex = Math.min(currentSlide + 1, maxIndex);
    setCurrentSlide(newIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentSlide - 1, 0);
    setCurrentSlide(newIndex);
    scrollToIndex(newIndex);
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">Web Stories</h2>
        <p className="text-sm">
          Cricket in 60 Seconds — Swipe through quick stories on match moments,
          player spotlights, and iconic plays.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
        >
          {facts.map((fact) => (
            <div
              key={fact.id}
              style={{ minWidth: `${100 / cardsPerView}%` }}
              className="flex-none rounded-xl overflow-hidden border border-gray-200 shadow"
            >
              <img
                src={fact.image}
                alt=""
                className="w-full h-[28.5rem] object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow -ml-4"
        >
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow -mr-4"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {facts.slice(0, facts.length - cardsPerView + 1).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              scrollToIndex(index);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
