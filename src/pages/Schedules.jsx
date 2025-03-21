import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const Schedules = () => {
  // Match data for completed matches
  const completedMatches = [
    {
      id: 1,
      date: "October 20, 2024",
      time: "07:30 PM",
      status: "COMPLETED",
      matchType: "Final",
      venue: "Dubai International Cricket Stadium",
      team1: { name: "South Africa Women", flag: "🇿🇦", score: "126/9 (20 ov)" },
      team2: { name: "New Zealand Women", flag: "🇳🇿", score: "158/5 (20 ov)" },
      result: "New Zealand Women won by 32 runs",
    },
    {
      id: 2,
      date: "October 18, 2024",
      time: "07:30 PM",
      status: "COMPLETED",
      matchType: "2nd Semi Final",
      venue: "Sharjah Cricket Stadium",
      team1: {
        name: "West Indies Women",
        flag: "🇼🇮",
        score: "120/8 (20 ov)",
      },
      team2: { name: "New Zealand Women", flag: "🇳🇿", score: "128/9 (20 ov)" },
      result: "New Zealand Women won by 8 runs",
    },
    {
      id: 3,
      date: "October 17, 2024",
      time: "07:30 PM",
      status: "COMPLETED",
      matchType: "1st Semi Final",
      venue: "Dubai International Cricket Stadium",
      team1: { name: "Australia Women", flag: "🇦🇺", score: "134/5 (20 ov)" },
      team2: {
        name: "South Africa Women",
        flag: "🇿🇦",
        score: "135/2 (17.2 ov)",
      },
      result: "South Africa Women won by 8 wickets",
    },
    {
      id: 4,
      date: "October 15, 2024",
      time: "07:30 PM",
      status: "COMPLETED",
      matchType: "Match 20",
      venue: "Dubai International Cricket Stadium",
      team1: { name: "England Women", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "141/7 (20 ov)" },
      team2: {
        name: "West Indies Women",
        flag: "🇼🇮",
        score: "144/4 (18 ov)",
      },
      result: "West Indies Women won by 6 wickets",
    },
  ];

  // Points table data
  const pointsTableData = [
    {
      id: 1,
      team: "WI-W",
      flag: "🇼🇮",
      matches: 4,
      wins: 3,
      losses: 1,
      points: 6,
    },
    {
      id: 2,
      team: "AUS-W",
      flag: "🇦🇺",
      matches: 4,
      wins: 4,
      losses: 0,
      points: 8,
    },
    {
      id: 3,
      team: "SA-W",
      flag: "🇿🇦",
      matches: 4,
      wins: 3,
      losses: 1,
      points: 6,
    },
    {
      id: 4,
      team: "NZ-W",
      flag: "🇳🇿",
      matches: 4,
      wins: 3,
      losses: 1,
      points: 6,
    },
    {
      id: 5,
      team: "ENG-W",
      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      matches: 4,
      wins: 3,
      losses: 1,
      points: 6,
    },
  ];

  // News data
  const newsItems = [
    {
      id: 1,
      title: "AUT-W vs JER-W Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 2,
      title: "DM vs RAD Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 3,
      title: "ICC Champions Trophy 2025: Jason Gillespie close to...",
      image: "/api/placeholder/400/200",
    },
    {
      id: 4,
      title: "KD vs BD Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 5,
      title: "RWA vs UGA Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 6,
      title: "JKB vs KMG Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 7,
      title: "AST vs UMA Dream11 Prediction Today Match, Dream11 Team",
      image: "/api/placeholder/400/200",
    },
    {
      id: 8,
      title: "IND-W B U19 vs SA-WU19 Dream11 Prediction Today...",
      image: "/api/placeholder/400/200",
    },
  ];

  // Trending players
  const trendingPlayers = [
    "Joe Root",
    "Virat Kohli",
    "Vinod Kambli",
    "Sherfane Rutherford",
    "Harry Brook",
    "Temba Bavuma",
    "Rohit Sharma",
    "Ben Curran",
    "Keshav Maharaj",
    "Travis Head",
  ];

  // FAQ questions
  const faqQuestions = [
    "What is the ICC Women's T20 World Cup match schedule?",
    "How does the ICC Women's T20 World Cup cricket schedule help in daily life?",
    "Where can I find the most recent ICC Women's T20 World Cup schedules?",
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main content section - 2/3 width */}
          <div className="lg:col-span-2">
            {/* ICC Women's T20 World Cup Schedule Header */}
            <div className="bg-white rounded p-4 mb-4">
              <h1 className="text-blue-600 font-bold text-lg mb-2">
                ICC Women's T20 World Cup Schedule
              </h1>
              <p className="text-gray-700 text-sm mb-2">
                The cricketing fraternity is eagerly waiting for the ICC Women's
                T20 World Cup 2024 to begin. The upcoming tournament will be the
                ninth edition of the Women's T20 World Cup. This year's
                competition is being played in the United Arab Emirates from
                October 3 to 20...
              </p>
              <button className="text-blue-600 text-sm font-medium">
                Read More
              </button>
            </div>

            {/* Filter section */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex-1">
                <div className="bg-white rounded flex items-center justify-between p-2">
                  <span className="text-gray-700">Team</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded flex items-center justify-between p-2">
                  <span className="text-gray-700">Venue</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="w-24">
                <button className="bg-white rounded p-2 text-sm w-full">
                  Clear Filter
                </button>
              </div>
            </div>

            {/* Recent filter button */}
            <div className="mb-4">
              <button className="bg-gray-200 rounded-full px-4 py-1 text-sm text-gray-700">
                Recent
              </button>
            </div>

            {/* Match results */}
            {completedMatches.map((match) => (
              <div
                key={match.id}
                className="flex bg-white rounded mb-4 overflow-hidden"
              >
                <div className="p-3 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-700">{match.date}</div>
                      <div className="text-gray-700 text-sm">{match.time}</div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-xs font-bold">
                      {match.status}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {match.matchType}
                    </span>
                    <span className="text-gray-600 text-sm">{match.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{match.team1.flag}</span>
                        <span className="text-gray-700">
                          {match.team1.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{match.team2.flag}</span>
                        <span className="text-gray-700">
                          {match.team2.name}
                        </span>
                      </div>
                      <div className="text-green-600 text-sm mt-2">
                        {match.result}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between text-right">
                      <div className="text-gray-700">{match.team1.score}</div>
                      <div className="text-gray-700">{match.team2.score}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 flex flex-col justify-end gap-4">
                  <button className="text-gray-600 text-sm">Scorecard</button>
                  <button className="text-gray-600 text-sm">Commentary</button>
                </div>
              </div>
            ))}

            {/* FAQ Section */}
            <div className="bg-white rounded p-4 mb-4">
              {faqQuestions.map((question, index) => (
                <div
                  key={index}
                  className="py-3 border-b last:border-b-0 flex justify-between items-center"
                >
                  <div className="text-gray-700">{question}</div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              ))}
            </div>

            {/* Trending Players Section */}
            <div className="bg-white rounded p-4">
              <h2 className="text-gray-800 font-bold text-lg mb-4">
                Trending Players
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-full px-3 py-1 text-sm flex items-center gap-1"
                  >
                    {player}
                    <ChevronRight size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar section - 1/3 width */}
          <div className="lg:col-span-1">
            {/* Points Table */}
            <div className="bg-white rounded mb-4">
              <div className="p-3 flex justify-between items-center border-b">
                <h2 className="text-blue-600 font-medium">
                  ICC Women's T20 World Cup
                </h2>
                <button className="text-xs flex items-center">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="p-3">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm">
                      <th className="pb-2 font-medium">No</th>
                      <th className="pb-2 font-medium">Team</th>
                      <th className="pb-2 font-medium text-center">M</th>
                      <th className="pb-2 font-medium text-center">W</th>
                      <th className="pb-2 font-medium text-center">L</th>
                      <th className="pb-2 font-medium text-center">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTableData.map((team) => (
                      <tr key={team.id} className="border-t">
                        <td className="py-2">{team.id}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-1">
                            <span>{team.flag}</span>
                            <span>{team.team}</span>
                          </div>
                        </td>
                        <td className="py-2 text-center">{team.matches}</td>
                        <td className="py-2 text-center">{team.wins}</td>
                        <td className="py-2 text-center">{team.losses}</td>
                        <td className="py-2 text-center font-bold">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white rounded">
              <div className="p-3 flex justify-between items-center border-b">
                <h2 className="text-gray-800 font-medium">Latest News</h2>
                <button className="text-xs flex items-center">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>
              <div>
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b last:border-b-0 p-3 flex gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="text-sm text-gray-800">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
