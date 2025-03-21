import React from "react";
import { FaChevronLeft, FaChevronRight, FaTrophy } from "react-icons/fa";
import TrendingPlayers from "../components/TrendingPlayers";
import volleyballPoster from "../assets/volleyballPoster.png";
import TopNewsSeriesTable from "../components/TopNewsSeriesTable";

const Match = () => {
  // Match Data
  const matchInfo = {
    league: "Indian Premier League",
    group: "Group - T20 - 58 of 61",
    teams: [
      { name: "Gujarat Titan", score: "171/8 (20)" },
      { name: "Royal Challengers Bangalore *", score: "160/6 (18.5)" },
    ],
    status: "RCB needs 12 runs in 7 balls",
  };

  // Ball by ball commentary
  const ballCommentary = [
    {
      over: "18.4",
      batsman: "H Pandya",
      bowler: "V Kohli",
      result: "SIX",
      commentary:
        "What a horrid start for the home team. It's a high, high full toss (well above the waist) outside off from round the wicket, a tiny shuffle and Imad Wasim mauls the pull many-a-mile over mid-wicket",
    },
    {
      over: "18.3",
      batsman: "H Pandya",
      bowler: "V Kohli",
      result: "2 Runs",
      commentary:
        "what a horrid start for the home team. It's a high, high full toss (well above the waist) outside off from round the wicket, a tiny shuffle and Imad Wasim mauls the pull many-a-mile over mid-wicket",
    },
  ];

  // Batters Data
  const batters = [
    {
      name: "Virat Kohli",
      runs: 49,
      balls: 27,
      fours: 4,
      sixes: 2,
      strikeRate: 145.6,
    },
    {
      name: "Mark Stekette *",
      runs: 24,
      balls: 12,
      fours: 4,
      sixes: 0,
      strikeRate: 123.4,
    },
  ];

  // Bowler Data
  const bowlers = [
    {
      name: "Hardik Pandya",
      overs: 3.4,
      maidens: 0,
      runs: 23,
      wickets: 2,
      economy: 6.2,
    },
  ];

  // IPL Table Data
  const iplTable = [
    { position: 1, team: "RCB*", matches: 10, points: 30, nrr: "+2.225" },
    { position: 2, team: "GT*", matches: 10, points: 27, nrr: "+2.054" },
    { position: 3, team: "CSK", matches: 10, points: 24, nrr: "+1.345" },
  ];

  // News Articles
  const newsArticles = [
    {
      category: "GAA Hurling",
      readTime: "5 min read",
      title: "Sam Mele, Major League Player, Manager and Scout, Dies at 95",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      category: "American Football",
      readTime: "5 min read",
      title: "Isaiah Thomas Scores 53 Points as Celtics Top Wizards",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      category: "Basketball",
      readTime: "5 min read",
      title:
        "Mets' Noah Syndergaard Out Indefinitely With Torn Muscle in Torso",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      category: "Horse Racing",
      readTime: "5 min read",
      title: "Wins Over Depression Encouraging Others Not to Debilitate",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  // Navigation tabs
  const tabs = [
    "Commentary",
    "Scorecard",
    "Squads",
    "Highlights",
    "Stats",
    "Venue",
  ];

  return (
    <div className=" mx-auto font-sans text-gray-800">
      {/* Main content grid */}
      <div className="flex gap-6">
        {/* Left column - Cricket pitch visualization */}
        <div className="w-1/3 relative shadow-lg bg-white p-4 border border-gray-200 rounded-lg">
          {/* Ball by ball navigation bottom of pitch */}
          <div className="bg-white">
            <div className="flex justify-between items-center px-2 py-1 text-xs">
              <button>
                <FaChevronLeft />
              </button>
              <span className="text-xs">18.4 H Pandya to V Kohli</span>
              <button>
                <FaChevronRight />
              </button>
            </div>

            {/* "It's a SIX" label */}
            <div className="bg-blue-600 text-white font-bold py-1 px-2 text-center text-sm">
              It's a SIX
            </div>

            {/* Commentary */}
            <div className="bg-gray-100 text-xs p-2">
              The pressure is released. Legbreak spinning and right in the arc
            </div>

            {/* Over balls display */}
            <div className="flex justify-center py-1 space-x-1 bg-white">
              <div className="w-6 h-6 border flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div className="w-6 h-6 border flex items-center justify-center text-xs">
                W
              </div>
              <div className="w-6 h-6 border flex items-center justify-center text-xs">
                2
              </div>
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                6
              </div>
              <div className="w-6 h-6 border flex items-center justify-center text-xs opacity-50">
                •
              </div>
              <div className="w-6 h-6 border flex items-center justify-center text-xs opacity-50">
                •
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Match details */}
        <div className="w-2/3 border bg-white rounded-lg shadow-lg border-gray-200">
          {/* Match information */}
          <div className="p-4 border-b border-gray-200">
            <div className="text-xs text-gray-500 mb-3">{matchInfo.group}</div>

            {/* Teams and scores */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm">{matchInfo.teams[0].name}</span>
              </div>
              <span className="text-sm">{matchInfo.teams[0].score}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <FaTrophy className="text-yellow-400 mr-2 text-sm" />
                <span className="text-sm">{matchInfo.teams[1].name}</span>
              </div>
              <span className="text-sm">{matchInfo.teams[1].score}</span>
            </div>

            <div className="text-xs mb-1">{matchInfo.status}</div>
          </div>

          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 text-xs font-medium cursor-pointer ${
                    index === 0
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {/* Batters statistics */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
              <div>Batter</div>
              <div className="text-center">R</div>
              <div className="text-center">B</div>
              <div className="text-center">4s</div>
              <div className="text-center">6s</div>
              <div className="text-center">SR</div>
            </div>

            {batters.map((batter, index) => (
              <div key={index} className="grid grid-cols-6 text-sm py-1">
                <div>{batter.name}</div>
                <div className="text-center">{batter.runs}</div>
                <div className="text-center">{batter.balls}</div>
                <div className="text-center">{batter.fours}</div>
                <div className="text-center">{batter.sixes}</div>
                <div className="text-center">{batter.strikeRate}</div>
              </div>
            ))}
          </div>

          {/* Bowlers statistics */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
              <div>Bowler</div>
              <div className="text-center">O</div>
              <div className="text-center">M</div>
              <div className="text-center">R</div>
              <div className="text-center">W</div>
              <div className="text-center">ECO</div>
            </div>

            {bowlers.map((bowler, index) => (
              <div key={index} className="grid grid-cols-6 text-sm py-1">
                <div>{bowler.name}</div>
                <div className="text-center">{bowler.overs}</div>
                <div className="text-center">{bowler.maidens}</div>
                <div className="text-center">{bowler.runs}</div>
                <div className="text-center">{bowler.wickets}</div>
                <div className="text-center">{bowler.economy}</div>
              </div>
            ))}
          </div>

          {/* Ball by ball commentary */}
          <div className="p-4">
            {ballCommentary.map((ball, index) => (
              <div
                key={index}
                className={`pb-3 ${
                  index < ballCommentary.length - 1
                    ? "border-b border-gray-200 mb-3"
                    : ""
                }`}
              >
                <div className="text-sm font-medium">
                  {ball.over} {ball.batsman} to {ball.bowler}
                  <span
                    className={`${
                      ball.result === "SIX" ? "text-blue-600 ml-1" : "ml-1"
                    }`}
                  >
                    {ball.result}
                  </span>
                </div>
                <div className="text-sm mt-1">{ball.commentary}</div>
              </div>
            ))}
          </div>
        </div>

        <TopNewsSeriesTable />
      </div>

      {/* Match Highlights section */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Match Highlights</h2>
          <button className="border border-gray-300 rounded px-3 py-1 text-xs">
            View all
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="grid grid-cols-4 gap-4">
          {newsArticles.map((article, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2">
                <img
                  src="/api/placeholder/220/150"
                  alt={article.title}
                  className="w-full h-28 object-cover"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="font-bold text-sm mb-1">{article.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{article.content}</p>
              <button className="text-xs flex items-center text-gray-600">
                Read more <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center space-x-1 mt-6 mb-4">
          <span className="text-xl text-gray-500">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center space-x-4 mt-4">
          <button className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
            <FaChevronLeft className="text-gray-500 text-xs" />
          </button>
          <button className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
            <FaChevronRight className="text-gray-500 text-xs" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-5">
        <div className="w-2/3">
          {/* trending players  */}
          <TrendingPlayers />
        </div>
        <div className="w-1/3">
          <img src={volleyballPoster} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Match;
