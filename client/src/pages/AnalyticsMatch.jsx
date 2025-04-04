import React from "react";
import {
  FaInfoCircle,
  FaChevronDown,
  FaMapMarkerAlt,
  FaFlag,
  FaClock,
} from "react-icons/fa";
import { IoTrophy } from "react-icons/io5";

const AnalyticsMatch = () => {
  // Sample data for the component
  const [activeTab, setActiveTab] = React.useState("squads");

  const teams = {
    team1: {
      flag: <span className="text-blue-600">🇧🇩</span>,
      score: "195/7",
      overs: "(20)",
    },
    team2: {
      flag: <span className="text-green-600">🇧🇩</span>,
      score: "156/10",
      overs: "(19.2)",
    },
  };

  const battingStats = [
    {
      name: "Tamim Iqbal",
      runs: 45,
      balls: 32,
      fours: 5,
      sixes: 2,
      strikeRate: 140.6,
    },
    {
      name: "Mushfiqur Rahim",
      runs: 62,
      balls: 42,
      fours: 6,
      sixes: 3,
      strikeRate: 147.6,
    },
    {
      name: "Mahmudullah",
      runs: 38,
      balls: 26,
      fours: 3,
      sixes: 2,
      strikeRate: 146.2,
    },
  ];

  const bowlingStats = [
    {
      name: "Taskin Ahmed",
      overs: "4.0",
      maidens: 0,
      runs: 32,
      wickets: 3,
      economy: 8.0,
    },
    {
      name: "Mustafizur Rahman",
      overs: "4.0",
      maidens: 0,
      runs: 28,
      wickets: 2,
      economy: 7.0,
    },
    {
      name: "Mohammad Saifuddin",
      overs: "3.2",
      maidens: 0,
      runs: 34,
      wickets: 2,
      economy: 10.2,
    },
  ];

  const fallOfWickets = [
    { score: "1-29", name: "Tamim Iqbal", overs: "3.2" },
    { score: "2-85", name: "Soumya Sarkar", overs: "9.1" },
    { score: "3-122", name: "Shakib Al Hasan", overs: "12.4" },
  ];

  const partnerships = [
    { players: "Tamim Iqbal & Soumya Sarkar", runs: "29", balls: "19" },
    { players: "Soumya Sarkar & Shakib Al Hasan", runs: "56", balls: "35" },
    { players: "Shakib Al Hasan & Mushfiqur Rahim", runs: "37", balls: "21" },
  ];

  const channels = [
    { logo: "📺", name: "GTV Bangladesh" },
    { logo: "📺", name: "Star Sports 1" },
    { logo: "📺", name: "Sky Sports Cricket" },
  ];

  const venues = [
    {
      name: "Shere-e-Bangla National Cricket Stadium",
      location: "Mirpur, Dhaka",
    },
  ];

  const playByPlayData = [
    {
      over: "19",
      bowler: { name: "Taskin Ahmed", image: "/api/placeholder/24/24" },
      batsman1: { name: "Mushfiqur Rahim", image: "/api/placeholder/24/24" },
      batsman2: { name: "Mahmudullah", image: "/api/placeholder/24/24" },
      balls: [
        { runs: "1", color: "bg-gray-500" },
        { runs: "0", color: "bg-gray-500" },
        { runs: "2", color: "bg-gray-500" },
        { runs: "4", color: "bg-blue-500" },
        { runs: "6", color: "bg-purple-500" },
        { runs: "W", color: "bg-red-500" },
      ],
    },
    {
      over: "18",
      bowler: { name: "Mustafizur Rahman", image: "/api/placeholder/24/24" },
      batsman1: { name: "Mushfiqur Rahim", image: "/api/placeholder/24/24" },
      batsman2: { name: "Mahmudullah", image: "/api/placeholder/24/24" },
      balls: [
        { runs: "1", color: "bg-gray-500" },
        { runs: "4", color: "bg-blue-500" },
        { runs: "1", color: "bg-gray-500" },
        { runs: "6", color: "bg-purple-500" },
        { runs: "2", color: "bg-gray-500" },
        { runs: "0", color: "bg-gray-500" },
      ],
    },
  ];

  const players = [
    { name: "Tamim Iqbal", role: "Batsman", image: "/api/placeholder/32/32" },
    {
      name: "Mushfiqur Rahim",
      role: "WK-Batsman",
      image: "/api/placeholder/32/32",
    },
    {
      name: "Shakib Al Hasan",
      role: "All-rounder",
      image: "/api/placeholder/32/32",
    },
    {
      name: "Mahmudullah",
      role: "All-rounder",
      image: "/api/placeholder/32/32",
    },
    {
      name: "Mustafizur Rahman",
      role: "Bowler",
      image: "/api/placeholder/32/32",
    },
    { name: "Taskin Ahmed", role: "Bowler", image: "/api/placeholder/32/32" },
    { name: "Soumya Sarkar", role: "Batsman", image: "/api/placeholder/32/32" },
    {
      name: "Mohammad Saifuddin",
      role: "All-rounder",
      image: "/api/placeholder/32/32",
    },
  ];

  const statsCategories = [
    { name: "Boundaries", team1: "16", team2: "12" },
    { name: "Dot Balls", team1: "42", team2: "46" },
    { name: "Run Rate", team1: "9.75", team2: "8.08" },
    { name: "Extras", team1: "9", team2: "7" },
  ];

  const odds = {
    fortuneBarishal: "1.65",
    chittagongKings: "2.25",
    prediction:
      "Fortune Barishal has a 65% chance of winning based on current form and head-to-head record.",
  };

  const matchSeries = [
    {
      team1: { name: "Fortune Barishal", flag: "🇧🇩", score: "195/7 (20)" },
      team2: { name: "Chittagong Kings", flag: "🇧🇩", score: "156/10 (19.2)" },
      tournament: "BPL 2023",
      venue: "Dhaka",
      date: "May 7, 2023",
    },
    {
      team1: { name: "Fortune Barishal", flag: "🇧🇩", score: "183/6 (20)" },
      team2: { name: "Chittagong Kings", flag: "🇧🇩", score: "187/4 (19.1)" },
      tournament: "BPL 2023",
      venue: "Sylhet",
      date: "Apr 22, 2023",
    },
  ];

  return (
    <div className="min-h-screen font-sans py-4">
      <div className="mx-auto rounded-lg overflow-hidden">
        {/* Breadcrumb navigation */}
        <div className="px-4 py-2 text-sm text-blue-600 flex gap-2 items-center border-b border-gray-200">
          <span>Cricket</span>
          <span>›</span>
          <span>Bangladesh</span>
          <span>›</span>
          <span>Bangladesh Premier League, Final</span>
          <span>›</span>
          <span className="text-gray-600">
            Fortune Barishal-Chittagong Kings live score, scorecard, head to
            head and match predictions
          </span>
        </div>

        {/* Match title */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            Fortune Barishal - Chittagong Kings
          </h1>
        </div>

        {/* Score summary */}
        <div className="flex flex-col md:flex-row">
          {/* Left column - Score card */}
          <div className="w-full md:w-1/3 p-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                <span>SCORECARD • 20.00</span>
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  {teams.team1.flag}
                  <span className="font-medium">FB</span>
                </div>
                <div className="font-semibold text-lg">{teams.team1.score}</div>
                <div className="text-sm text-gray-600">{teams.team1.overs}</div>
              </div>
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  {teams.team2.flag}
                  <span className="font-medium">CHK</span>
                </div>
                <div className="font-semibold text-lg">{teams.team2.score}</div>
                <div className="text-sm text-gray-600">{teams.team2.overs}</div>
              </div>
              <div className="bg-blue-50 p-4 text-sm text-blue-900 border-t border-gray-200">
                <p>Fortune Barishal won by 39 runs</p>
              </div>
              <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
                <p>MAY 7, 2023 • 11:20</p>
                <p className="mt-1">
                  Fortune Barishal beat Chittagong Kings by 39 runs in Dhaka
                </p>
              </div>
            </div>

            {/* Runs per Over */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm flex justify-between items-center">
                <span className="font-medium">Runs per Over</span>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <div className="p-4">
                <button className="border-0 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                  All innings
                </button>
              </div>
              <div className="p-4 border-t border-gray-200">
                {/* Graph placeholder */}
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400">Runs per over graph</span>
                </div>
              </div>
            </div>

            {/* Team names */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                {teams.team1.flag}
                <span className="font-medium">Fortune Barishal</span>
              </div>
              <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                {teams.team2.flag}
                <span className="font-medium">Chittagong Kings</span>
              </div>
              <div className="p-4 border-b border-gray-200">
                <select className="w-full border border-gray-200 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Chittagong Kings 1st Innings</option>
                </select>
              </div>

              {/* Batting stats */}
              <div className="p-4 text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="p-2 text-left font-medium">Batsman</th>
                      <th className="p-2 text-center font-medium">R</th>
                      <th className="p-2 text-center font-medium">B</th>
                      <th className="p-2 text-center font-medium">4s</th>
                      <th className="p-2 text-center font-medium">6s</th>
                      <th className="p-2 text-center font-medium">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {battingStats.map((player, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-2 text-left">{player.name}</td>
                        <td className="p-2 text-center font-medium">
                          {player.runs}
                        </td>
                        <td className="p-2 text-center">{player.balls}</td>
                        <td className="p-2 text-center">{player.fours}</td>
                        <td className="p-2 text-center">{player.sixes}</td>
                        <td className="p-2 text-center">{player.strikeRate}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-medium">
                      <td className="p-2 text-left">Extras</td>
                      <td className="p-2 text-center">9</td>
                      <td className="p-2" colSpan={4}>
                        (b 1, lb 2, w 5, nb 1, p 0)
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200 font-medium bg-gray-50">
                      <td className="p-2 text-left">Total</td>
                      <td className="p-2 text-center">195/7</td>
                      <td className="p-2" colSpan={4}>
                        (20)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Did not bat */}
              <div className="px-4 py-3 text-xs border-t border-gray-200 bg-gray-50">
                <p className="font-medium text-gray-700">Did not bat:</p>
                <p className="mt-1 text-gray-600">
                  Mohammad Mithu, Hassan Ali, Mustafiz Ahmed, Shakib Ahmed,
                  Shoriful Islam
                </p>
              </div>

              {/* Fall of Wickets */}
              <div className="px-4 py-3 text-xs border-t border-gray-200">
                <p className="font-medium text-gray-700">Fall of Wickets:</p>
                <div className="mt-1 space-y-1 text-gray-600">
                  {fallOfWickets.map((wicket, idx) => (
                    <p key={idx}>
                      {wicket.score} ({wicket.name}, {wicket.overs} ov)
                    </p>
                  ))}
                </div>
              </div>

              {/* Bowling stats */}
              <div className="p-4 text-xs border-t border-gray-200 bg-gray-50">
                <p className="font-medium px-1 mb-2 text-gray-700">Bowler</p>
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="p-2 text-left font-medium">Name</th>
                      <th className="p-2 text-center font-medium">O</th>
                      <th className="p-2 text-center font-medium">M</th>
                      <th className="p-2 text-center font-medium">R</th>
                      <th className="p-2 text-center font-medium">W</th>
                      <th className="p-2 text-center font-medium">ER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlingStats.map((player, idx) => (
                      <tr
                        key={idx}
                        className={idx > 0 ? "border-t border-gray-200" : ""}
                      >
                        <td className="p-2 text-left">{player.name}</td>
                        <td className="p-2 text-center">{player.overs}</td>
                        <td className="p-2 text-center">{player.maidens}</td>
                        <td className="p-2 text-center">{player.runs}</td>
                        <td className="p-2 text-center font-medium">
                          {player.wickets}
                        </td>
                        <td className="p-2 text-center">{player.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Partnerships table */}
              <div className="p-4 text-xs border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-700">Partnership</p>
                  <p className="text-gray-500">Runs</p>
                </div>
                <table className="w-full">
                  <tbody>
                    {partnerships.map((p, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="p-2 text-left">{p.players}</td>
                        <td className="p-2 text-right">{p.runs}</td>
                        <td className="p-2 text-right text-gray-500">
                          {p.balls}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Poll */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium">
                <span>Who will win?</span>
              </div>
              <div className="p-4">
                <div className="flex mb-1 h-8 rounded-md overflow-hidden">
                  <div
                    className="bg-green-500 text-white px-3 py-1 text-sm flex items-center"
                    style={{ width: "65%" }}
                  >
                    Fortune Barishal (65%)
                  </div>
                  <div
                    className="bg-blue-500 text-white px-3 py-1 text-sm flex items-center"
                    style={{ width: "35%" }}
                  >
                    Chittagong Kings (35%)
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Total votes: 12k</p>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm font-medium">
                <span>Media</span>
              </div>
              <div className="p-4">
                <div className="relative rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/api/placeholder/200/120"
                    alt="Match highlights"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 text-xs rounded-br-lg">
                    FBA 195 - 156 CHK
                  </div>
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white px-3 py-1 text-xs rounded-bl-lg">
                    2:45
                  </div>
                </div>
                <p className="text-xs mt-2 font-medium">Highlights</p>
              </div>
            </div>

            {/* TV Channels */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-sm flex justify-between items-center">
                <span className="font-medium">TV Channels</span>
                <div className="flex gap-1">
                  <span className="text-yellow-500">★</span>
                  <FaChevronDown className="text-gray-400" />
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {channels.map((channel, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="text-blue-600">{channel.logo}</div>
                      <span>{channel.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Venue details */}
            <div className="mt-6 text-sm space-y-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              {venues.map((venue, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">{venue.name}</p>
                    <p className="text-gray-600">{venue.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Play by play */}
          <div className="w-full md:w-2/3 p-4">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "squads"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                onClick={() => setActiveTab("squads")}
              >
                Play-by-play
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "stats"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors`}
                onClick={() => setActiveTab("stats")}
              >
                Statistics
              </button>
            </div>

            {/* Content container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Team headers */}
              <div className="grid grid-cols-12 p-4 bg-gray-50 border-b border-gray-200">
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    {teams.team1.flag}
                    <span className="font-medium">Fortune Barishal</span>
                  </div>
                </div>
                <div className="col-span-4 flex justify-center text-gray-500 text-sm">
                  <span>Over</span>
                </div>
                <div className="col-span-4 flex justify-end">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Chittagong Kings</span>
                    {teams.team2.flag}
                  </div>
                </div>
              </div>

              {/* Play by play content */}
              <div>
                {playByPlayData.map((over, idx) => (
                  <div key={idx} className="border-b border-gray-200">
                    <div className="bg-gray-50 p-3 text-sm flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Over {over.over}</span>
                        <div className="flex items-center">
                          <img
                            src={over.bowler.image}
                            alt={over.bowler.name}
                            className="w-5 h-5 rounded-full mr-1"
                          />
                          <span className="text-gray-700">
                            {over.bowler.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-600 font-medium">
                        {idx === 0
                          ? "6 Runs"
                          : idx === 1
                          ? "14 Runs"
                          : "8 Runs"}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">
                          6 balls to Mahmudullah & 0 players in {over.over}.0
                        </p>
                        <div className="flex gap-2 mt-1">
                          {over.balls.map((ball, ballIdx) => (
                            <span
                              key={ballIdx}
                              className={`${ball.color} w-7 h-7 flex items-center justify-center text-xs rounded-md text-white shadow-sm font-medium`}
                            >
                              {ball.runs}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <img
                            src={over.batsman1.image}
                            alt={over.batsman1.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium">
                            {over.batsman1.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {over.batsman2.name}
                          </span>
                          <img
                            src={over.batsman2.image}
                            alt={over.batsman2.name}
                            className="w-6 h-6 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Squads section */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h2 className="font-medium">Squads</h2>
              </div>
              <div className="p-4">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="font-medium mb-4 text-gray-800">Playing XI</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.slice(0, 6).map((player, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-10 h-10 rounded-full shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {player.name}
                          </p>
                          <p className="text-xs text-gray-500">{player.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4 text-gray-800">
                    Rest of Squad
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {players.slice(6).map((player, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-10 h-10 rounded-full shadow-sm"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {player.name}
                          </p>
                          <p className="text-xs text-gray-500">{player.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics radar chart */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Wagon wheel appearance</h3>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <div className="p-6">
                <div className="relative h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  {/* This is a placeholder for the radar chart */}
                  <div className="w-48 h-48 bg-white rounded-full relative overflow-hidden shadow-md">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">
                        Wagon wheel chart
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match stats comparison */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Match Stats</h3>
                <FaInfoCircle className="text-gray-400" />
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {statsCategories.map((stat, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-left">{stat.team1}</span>
                        <span className="font-medium">{stat.name}</span>
                        <span className="text-right">{stat.team2}</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                        <div
                          className="bg-blue-500"
                          style={{
                            width: `${
                              (parseInt(stat.team1) /
                                (parseInt(stat.team1) + parseInt(stat.team2))) *
                              100
                            }%`,
                          }}
                        ></div>
                        <div
                          className="bg-green-500"
                          style={{
                            width: `${
                              (parseInt(stat.team2) /
                                (parseInt(stat.team1) + parseInt(stat.team2))) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Match odds */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Match Odds</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Updated 15 mins ago</span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border border-gray-200 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-600">Fortune Barishal</p>
                    <p className="font-bold text-lg">{odds.fortuneBarishal}</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3 text-center">
                    <p className="text-sm text-gray-600">Chittagong Kings</p>
                    <p className="font-bold text-lg">{odds.chittagongKings}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <p>{odds.prediction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Head to head */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-medium">Head to Head</h3>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <IoTrophy className="text-yellow-500" />
                  <span>Last 5 matches</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">3</div>
                    <p className="text-sm text-gray-600">
                      Fortune Barishal wins
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-500">0</div>
                    <p className="text-sm text-gray-600">Draw</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2</div>
                    <p className="text-sm text-gray-600">
                      Chittagong Kings wins
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {matchSeries.map((match, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span>{match.team1.flag}</span>
                          <span className="font-medium">
                            {match.team1.name}
                          </span>
                          <span className="text-gray-600">
                            {match.team1.score}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">
                            {match.team2.score}
                          </span>
                          <span className="font-medium">
                            {match.team2.name}
                          </span>
                          <span>{match.team2.flag}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaFlag className="text-gray-400" />
                          <span>{match.tournament}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{match.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span>{match.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
          <p>
            All stats and information shown is for entertainment purposes only.
          </p>
          <p className="mt-1">© 2023 Cricket Stats App - All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMatch;
