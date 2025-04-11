import { useState } from "react";
import facts1 from "../assets/facts1.jpg";
import facts2 from "../assets/facts2.jpg";
import facts3 from "../assets/facts3.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function InterestingFactsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample facts data - replace with your actual data
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === facts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? facts.length - 1 : prev - 1));
  };

  return (
    <div className="w-full h-fit bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="bg-orange-100 p-1 rounded-lg">
          <span className="text-2xl">🤔</span>
        </div>
        <h2 className="ml-2 text-xl font-bold">Interesting Facts</h2>
      </div>

      <div className="relative flex-grow flex flex-col">
        <div className="rounded-2xl overflow-hidden relative flex-grow">
          <img src={facts[currentSlide].image} alt="" />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-full transform -translate-y-1/2 bg-blue-600 text-white cursor-pointer rounded-full w-8 h-8 flex items-center justify-center shadow-md -ml-3"
        >
          <span className="text-xl font-bold">
            <FaChevronLeft />
          </span>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-full transform -translate-y-1/2 bg-blue-600 cursor-pointer text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md -mr-3"
        >
          <FaChevronRight />
        </button>

        {/* Pagination dots */}
        <div className="mt-4 flex justify-center space-x-2">
          {facts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
