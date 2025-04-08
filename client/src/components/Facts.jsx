import { useState } from "react";

export default function InterestingFactsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample facts data - replace with your actual data
  const facts = [
    {
      id: 1,
      image: "/api/placeholder/400/320",
      title:
        "RIVAN PARAG TO LEAD RAJASTHAN ROYALS IN THE FIRST THREE GAMES, WITH SAMSON PLAYING AS A BATTER DUE TO A FINGER INJURY",
    },
    {
      id: 2,
      image: "/api/placeholder/400/320",
      title: "MS DHONI BECOMES THE FIRST PLAYER TO FEATURE IN 250 IPL MATCHES",
    },
    {
      id: 3,
      image: "/api/placeholder/400/320",
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
    <div className="w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="bg-orange-100 p-1 rounded-lg">
          <span className="text-2xl">🤔</span>
        </div>
        <h2 className="ml-2 text-xl font-bold">Interesting Facts</h2>
      </div>

      <div className="relative flex-grow flex flex-col">
        <div className="rounded-2xl overflow-hidden relative flex-grow">
          <img
            src={facts[currentSlide].image}
            alt="Cricket fact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-800 bg-opacity-80 flex items-center">
            <div className="p-6 w-full">
              <div className="text-white font-bold text-xl leading-tight">
                {facts[currentSlide].title}
              </div>
              <div className="absolute bottom-4 right-4">
                <img
                  src="/api/placeholder/40/40"
                  alt="Team logo"
                  className="w-10 h-10 rounded-full bg-white p-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md -ml-3"
        >
          <span className="text-xl font-bold">&lt;</span>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md -mr-3"
        >
          <span className="text-xl font-bold">&gt;</span>
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
