import React from "react";
import {
  FaRegStar,
  FaStar,
  FaCalendarPlus,
  FaAngleRight,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const AnalyticsSeries = () => {
  // JSON data for the page
  const matchInfo = {
    team1: {
      name: "Fortune Barishal",
      shortName: "FBA",
      odds: 1.5,
      winPercentage: "67%",
      actualWinRate: "80%",
    },
    team2: {
      name: "Chittagong Kings",
      shortName: "CHK",
    },
    matchDetails: {
      date: "07/02/2025",
      time: "17:30",
      competition: "Cricket, Bangladesh, Bangladesh Premier League, Final",
      venue: "Sher-e-Bangla National Cricket Stadium",
      location: "Dhaka, Bangladesh",
      startTime: "12:00:00 PM UTC",
      startDate: "Feb 7, 2025",
    },
  };

  const matchHistory = [
    {
      date: "7 Feb",
      tournament: "Bangladesh Premier League",
      team1: "FBA",
      team2: "CHK",
      score1: "201-6",
      score2: "200",
      overs1: "(46.0)",
      overs2: "(43.4)",
      description: "Fortune Barishal Vs Chittagong Kings",
    },
    {
      date: "3 Feb",
      tournament: "Bangladesh Premier League",
      team1: "FBA",
      team2: "CHK",
      score1: "150-1",
      score2: "149-9",
      overs1: "(17.2)",
      overs2: "(20.0)",
      description: "Fortune Barishal beat Chittagong Kings by 9 wickets",
      result: "W",
    },
    {
      date: "5 Feb",
      tournament: "Bangladesh Premier League",
      team1: "CHK",
      team2: "KHT",
      score1: "164-8",
      score2: "163-6",
      overs1: "(20.0)",
      overs2: "(20.0)",
      description: "Chittagong Kings beat Khulna Tigers by 2 wickets",
      result: "W",
    },
    {
      date: "3 Feb",
      tournament: "Bangladesh Premier League",
      team1: "FBA",
      team2: "CHK",
      score1: "182-7",
      score2: "206-4",
      overs1: "(20.0)",
      overs2: "(20.0)",
      description: "Fortune Barishal beat Chittagong Kings by 9 wickets",
      result: "L",
    },
    {
      date: "1 Feb",
      tournament: "Bangladesh Premier League",
      team1: "CHK",
      team2: "FBA",
      description: "Chittagong Kings beat Fortune Barishal by 24 runs",
    },
  ];

  const infoLinks = [
    "Team match schedule for current tournament",
    "Play by play",
    "Wargon wheel",
    "Number of wins and losses",
    "List of players",
    "Cricket match commentary",
    "Statistics for each inning",
    "Scorecard",
  ];

  // Tournament buttons data
  const tournamentOptions = ["Home", "This Tournament"];

  return (
    <div className=" mx-auto  p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-blue-600 mb-4 flex items-center gap-2">
        <span>Cricket</span>
        <span className="text-gray-500">&gt;</span>
        <span>Bangladesh</span>
        <span className="text-gray-500">&gt;</span>
        <span>Bangladesh Premier League, Final</span>
        <span className="text-gray-500">&gt;</span>
        <span className="text-gray-500">
          Fortune Barishal vs Chittagong Kings live score, scorecard, head to
          head and match predictions
        </span>
      </div>

      {/* Match Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Fortune Barishal - Chittagong Kings
        </h1>
        <FaRegStar className="text-xl text-gray-400" />
      </div>

      {/* Main Content Grid */}
      <div className="flex  gap-4">
        {/* Left Column */}
        <div className="flex-[0.4] space-y-4">
          {/* Teams and Time */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-blue-800">FBA</span>
                </div>
                <span className="text-xs">FBA</span>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold">17:30</div>
                <div className="text-sm text-gray-500">Today</div>
                <div className="text-xs text-gray-400">07:28:52</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-red-800">CHK</span>
                </div>
                <span className="text-xs">CHK</span>
              </div>
            </div>

            {/* Toss Betting */}
            <div className="bg-blue-50 p-3 rounded mb-4">
              <div className="text-sm mb-2">To win the toss</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-2 rounded border border-gray-200 text-center">
                  <div className="font-bold">1</div>
                  <div className="text-xs text-gray-500">→ 1.91</div>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200 text-center">
                  <div className="font-bold text-green-600">2</div>
                  <div className="text-xs text-gray-500">→ 1.91</div>
                </div>
              </div>
              <div className="flex justify-between mt-3 text-xs">
                <div className="text-blue-800">Gamble responsibly 18+</div>
                <div className="text-blue-800 flex items-center">
                  Additional Odds <FaAngleRight className="ml-1" />
                </div>
              </div>
            </div>

            {/* Win Prediction */}
            <div>
              <div className="text-sm mb-2">Who will win?</div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <button className="bg-green-600 text-white py-2 rounded font-bold">
                  1
                </button>
                <button className="bg-blue-600 text-white py-2 rounded font-bold">
                  2
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Your prediction, your game - cast your vote!
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="bg-white p-4 rounded shadow space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">Date and Time</div>
                <div className="font-medium">07/02/2025 • 17:30</div>
              </div>
              <button className="text-blue-600 text-sm flex items-center">
                Add to Calendar <FaCalendarPlus className="ml-1" />
              </button>
            </div>

            <div>
              <div className="text-xs text-gray-500">Competition</div>
              <div className="font-medium flex justify-between">
                <span>
                  Cricket, Bangladesh, Bangladesh Premier League, Final
                </span>
                <FaAngleRight />
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Venue</div>
              <div className="font-medium flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                <span>Sher-e-Bangla National Cricket Stadium</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Location</div>
              <div className="font-medium flex items-center">
                <div className="w-6 h-6 bg-green-600 rounded-full mr-2 flex items-center justify-center text-white text-xs">
                  BD
                </div>
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* About the match */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">About the match</h3>
            <p className="text-sm mb-2">
              Fortune Barishal vs Chittagong Kings match is part of{" "}
              <span className="text-blue-600">Bangladesh Premier League</span>.
              The match starts on Feb 7, 2025, 12:00:00 PM UTC.
            </p>
            <p className="text-sm mb-4">
              Game is played at Sher-e-Bangla National Cricket Stadium.
            </p>

            <p className="text-sm mb-2">
              Sofascore match page offers all previous{" "}
              <span className="text-blue-600">
                Fortune Barishal v Chittagong Kings
              </span>{" "}
              matches and results sorted by their H2H schedule. Here you can
              find:
            </p>

            <ul className="list-disc pl-6 text-sm mb-4 space-y-1">
              {infoLinks.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>

            <p className="text-sm">
              This information can help you decide on Fortune Barishal -
              Chittagong Kings game prediction. Even though Sofascore doesn't
              offer direct betting, it provides the best odds and shows you
              which sites offer live betting.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-4">
          {/* Odds */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Odds</h3>

            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xs font-bold text-blue-800">FB</span>
              </div>
              <span className="font-bold mr-4">FBA</span>
              <span className="text-xl font-bold mr-2">1.50</span>
              <span className="text-gray-400">=</span>
              <span className="text-gray-600 ml-2">
                {matchInfo.team1.winPercentage}
              </span>
              <div className="ml-auto bg-orange-400 text-white px-3 py-1 rounded">
                W: {matchInfo.team1.actualWinRate}
              </div>
            </div>

            <p className="text-sm">
              When the odds are 1.50, the expected chance of winning is 67%, but
              Fortune Barishal actually wins 80% of the time with these odds.
            </p>
          </div>

          {/* Matches */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Matches</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 Column */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-blue-800">FB</span>
                  </div>
                  <span className="text-blue-600 font-medium">
                    Fortune Barishal
                  </span>
                </div>

                <div className="flex gap-4 mb-6">
                  {tournamentOptions.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="team1_tournament"
                        className="mr-1"
                        defaultChecked={index === 0}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>

                {matchHistory
                  .filter(
                    (match) => match.team1 === "FBA" || match.team2 === "FBA"
                  )
                  .slice(0, 3)
                  .map((match, index) => (
                    <div key={index} className="mb-6 border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs mr-2">
                          BPL
                        </div>
                        <span className="text-sm text-blue-600">
                          Bangladesh Premier League
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-blue-800">
                              FB
                            </span>
                          </div>
                          <span className="text-sm">{match.team1}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold">{match.score1}</span>
                          <span className="text-gray-500 text-sm">
                            {match.overs1}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-red-800">
                              CK
                            </span>
                          </div>
                          <span className="text-sm">{match.team2}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold">{match.score2}</span>
                          <span className="text-gray-500 text-sm">
                            {match.overs2}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{match.date}</span>
                        <span>•</span>
                        <span>{match.description}</span>
                        {match.result && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                              match.result === "W"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {match.result}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Team 2 Column */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xs font-bold text-red-800">CK</span>
                  </div>
                  <span className="text-blue-600 font-medium">
                    Chittagong Kings
                  </span>
                </div>

                <div className="flex gap-4 mb-6">
                  {tournamentOptions.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="team2_tournament"
                        className="mr-1"
                        defaultChecked={index === 0}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>

                {matchHistory
                  .filter(
                    (match) => match.team1 === "CHK" || match.team2 === "CHK"
                  )
                  .slice(0, 3)
                  .map((match, index) => (
                    <div key={index} className="mb-6 border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs mr-2">
                          BPL
                        </div>
                        <span className="text-sm text-blue-600">
                          Bangladesh Premier League
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">
                              {match.team1 === "CHK" ? "CK" : match.team1}
                            </span>
                          </div>
                          <span className="text-sm">{match.team1}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold">{match.score1}</span>
                          <span className="text-gray-500 text-sm">
                            {match.overs1}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">
                              {match.team2 === "CHK" ? "CK" : match.team2}
                            </span>
                          </div>
                          <span className="text-sm">{match.team2}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold">{match.score2}</span>
                          <span className="text-gray-500 text-sm">
                            {match.overs2}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{match.date}</span>
                        <span>•</span>
                        <span>{match.description}</span>
                        {match.result && (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                              match.result === "W"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {match.result}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Head-to-Head */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-3">Head-to-head</h3>

            <div className="flex gap-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="head_to_head"
                  className="mr-1"
                  defaultChecked
                />
                <span className="text-sm">At Fortune Barishal</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="head_to_head" className="mr-1" />
                <span className="text-sm">This Tournament</span>
              </label>
            </div>

            {matchHistory
              .filter((match, index) => index < 2)
              .map((match, index) => (
                <div key={index} className="mb-6 border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs mr-2">
                      BPL
                    </div>
                    <span className="text-sm text-blue-600">
                      Bangladesh Premier League
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-blue-800">
                          FB
                        </span>
                      </div>
                      <span className="text-sm">FBA</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold">{match.score1}</span>
                      <span className="text-gray-500 text-sm">
                        {match.overs1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-red-800">
                          CK
                        </span>
                      </div>
                      <span className="text-sm">CHK</span>
                    </div>

                    <div className="text-right">
                      <span className="font-bold">{match.score2}</span>
                      <span className="text-gray-500 text-sm">
                        {match.overs2}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{match.date}</span>
                    <span>•</span>
                    <span>{match.description}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSeries;
