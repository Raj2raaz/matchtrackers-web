import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaMapMarkerAlt,
} from "react-icons/fa";
import TrendingPlayers from "../components/TrendingPlayers";
import volleyballPoster from "../assets/volleyballPoster.png";
import TopNews from "../components/TopNews";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../utils/axios";
import Image from "../components/Image";

const Match = () => {
  const navigate = useNavigate();
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

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [score, setScore] = useState(null);
  const [commentary, setCommentary] = useState(null);
  const [activeTab, setActiveTab] = useState("Info");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchResponse, scoreResponse, commResponse] = await Promise.all([
          apiClient.get(`/mcenter/v1/${id}`),
          apiClient.get(`/mcenter/v1/${id}/scard`),
          apiClient.get(`/mcenter/v1/${id}/comm`),
        ]);

        setData(matchResponse.data);
        setScore(scoreResponse.data);
        setCommentary(commResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const tabs = ["Info", "Squads"];

  const getBatters = (scorecard) => {
    return scorecard?.batsman.filter((batsman) => batsman.balls > 0) || [];
  };

  const getBowlers = (scorecard) => {
    return scorecard?.bowler.filter((bowler) => bowler.overs) || [];
  };

  const getBallCommentary = (scorecard) => {
    if (!scorecard) return [];
    // Assuming you have a way to access ball by ball commentary from API, replace this with your actual data fetching.
    return [
      {
        over: "3.6",
        batsman: "Kohli",
        bowler: "Narine",
        result: "1 run",
        commentary:
          "Quicker and just outside off, Kohli punches it to long-off for a single.",
      },
      {
        over: "3.5",
        batsman: "Salt",
        bowler: "Narine",
        result: "SIX",
        commentary:
          "Tossed up on middle, Salt comes down the track and smashes it over long-on for a maximum!",
      },
    ];
  };

  // Get player role color
  const getRoleColor = (role) => {
    if (role.includes("Batsman")) return "bg-blue-100 text-blue-800";
    if (role.includes("Bowler")) return "bg-green-100 text-green-800";
    if (role.includes("Allrounder")) return "bg-purple-100 text-purple-800";
    if (role.includes("WK")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Render squads tab content
  const renderSquadsTab = () => {
    return (
      <div className="p-4">
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">
            {data?.matchInfo?.team1.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.matchInfo?.team1.playerDetails
              .filter((player) => !player.isSupportStaff && !player.substitute)
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() => navigate("/player/" + player.id)}
                  className="border cursor-pointer border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      faceImageId={player?.faceImageId}
                      className="h-7 w-7 rounded-full"
                    />

                    <div className="font-medium">{player.fullName}</div>
                  </div>
                  <div>
                    {player.captain && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                        Captain
                      </span>
                    )}
                    {player.keeper && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Keeper
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-0.5 rounded ${getRoleColor(
                        player.role
                      )}`}
                    >
                      {player.role}
                    </span>
                    {player.isOverseas && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        Overseas
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {player.battingStyle} Bat
                    </span>
                    {player.bowlingStyle && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.bowlingStyle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">
            {data?.matchInfo?.team2.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data?.matchInfo?.team2?.playerDetails
              .filter((player) => !player.isSupportStaff && !player.substitute)
              .map((player) => (
                <div
                  onClick={() => navigate("/player/" + player.id)}
                  key={`team2-${player.id}`}
                  className="border cursor-pointer border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      faceImageId={player?.faceImageId}
                      className="h-7 w-7 rounded-full"
                    />

                    <div className="font-medium">{player.fullName}</div>
                  </div>
                  <div>
                    {player.captain && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mr-1">
                        Captain
                      </span>
                    )}
                    {player.keeper && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Keeper
                      </span>
                    )}
                  </div>
                  <div className="text-xs flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-0.5 rounded ${getRoleColor(
                        player.role
                      )}`}
                    >
                      {player.role}
                    </span>
                    {player.isOverseas && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        Overseas
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {player.battingStyle} Bat
                    </span>
                    {player.bowlingStyle && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                        {player.bowlingStyle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Render info tab content
  const renderInfoTab = () => {
    return (
      <>
        <div className="p-4 ">
          <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
            <div>Batter</div>
            <div className="text-center">R</div>
            <div className="text-center">B</div>
            <div className="text-center">4s</div>
            <div className="text-center">6s</div>
            <div className="text-center">SR</div>
          </div>

          {score?.scorecard?.length > 0 &&
            getBatters(score?.scorecard[1]).map((batter, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 grid-cols-6 text-sm py-2"
              >
                <div className="w-[6rem] truncate">{batter.name}</div>
                <div className="text-center">{batter.runs}</div>
                <div className="text-center">{batter.balls}</div>
                <div className="text-center">{batter.fours}</div>
                <div className="text-center">{batter.sixes || 0}</div>
                <div className="text-center">{batter.strkRate}</div>
              </div>
            ))}
        </div>

        <div className="p-4 ">
          <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
            <div>Bowler</div>
            <div className="text-center">O</div>
            <div className="text-center">M</div>
            <div className="text-center">R</div>
            <div className="text-center">W</div>
            <div className="text-center">ECO</div>
          </div>

          {score?.scorecard?.length > 0 &&
            getBowlers(score?.scorecard[0]).map((bowler, index) => (
              <div
                key={index}
                className="grid border-b border-gray-200 grid-cols-6 text-sm py-2"
              >
                <div className="w-[6rem] truncate">{bowler.name}</div>
                <div className="text-center">{bowler.overs}</div>
                <div className="text-center">{bowler.maidens || 0}</div>
                <div className="text-center">{bowler.runs}</div>
                <div className="text-center">{bowler.wickets}</div>
                <div className="text-center">{bowler.economy}</div>
              </div>
            ))}
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto font-sans text-gray-800">
      <div className="flex gap-6">
        <div className="w-1/3 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with team score */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">
                {commentary?.miniscore?.batTeam?.teamScore}/
                {commentary?.miniscore?.batTeam?.teamWkts}
              </h1>
              <span className="text-sm bg-blue-900 px-2 py-1 rounded-full">
                {commentary?.miniscore?.matchStatus}
              </span>
            </div>
          </div>

          {/* Recent Balls - Visual timeline */}
          <div className="bg-gray-50 px-4 py-3">
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-500 mr-2">RECENT</span>
              <div className="flex space-x-1">
                {commentary?.miniscore?.recentOvsStats
                  .trim()
                  .split(/\s+/)
                  .slice(-8)
                  .map((ball, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium 
                ${ball === "6" ? "bg-blue-600 text-white" : ""} 
                ${ball === "4" ? "bg-green-500 text-white" : ""}
                ${ball === "W" ? "bg-red-600 text-white font-bold" : ""} 
                ${ball === "|" ? "border-none" : ""}
                ${!["6", "4", "W", "|"].includes(ball) ? "bg-gray-200" : ""}`}
                    >
                      {ball === "|" ? "•" : ball}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Active players section */}
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <div className="w-1/2 pr-2">
                <h2 className="text-xs uppercase text-gray-500 mb-2">
                  BATTING
                </h2>

                {/* Striker */}
                <div className="mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-sm">
                      {commentary?.miniscore?.batsmanStriker.batName}
                    </span>
                  </div>
                  <div className="flex mt-1">
                    <span className="text-xl font-bold mr-2">
                      {commentary?.miniscore?.batsmanStriker.batRuns}
                    </span>
                    <span className="text-xs text-gray-500 self-end mb-1">
                      ({commentary?.miniscore?.batsmanStriker.batBalls})
                    </span>
                  </div>
                  <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                    <span>
                      4s: {commentary?.miniscore?.batsmanStriker.batFours}
                    </span>
                    <span>
                      6s: {commentary?.miniscore?.batsmanStriker.batSixes}
                    </span>
                    <span>
                      SR: {commentary?.miniscore?.batsmanStriker.batStrikeRate}
                    </span>
                  </div>
                </div>

                {/* Non-Striker */}
                <div>
                  <div className="flex items-center">
                    <span className="text-sm">
                      {commentary?.miniscore?.batsmanNonStriker.batName}
                    </span>
                  </div>
                  <div className="flex mt-1">
                    <span className="text-xl font-bold mr-2">
                      {commentary?.miniscore?.batsmanNonStriker.batRuns}
                    </span>
                    <span className="text-xs text-gray-500 self-end mb-1">
                      ({commentary?.miniscore?.batsmanNonStriker.batBalls})
                    </span>
                  </div>
                  <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                    <span>
                      4s: {commentary?.miniscore?.batsmanNonStriker.batFours}
                    </span>
                    <span>
                      6s: {commentary?.miniscore?.batsmanNonStriker.batSixes}
                    </span>
                    <span>
                      SR:{" "}
                      {commentary?.miniscore?.batsmanNonStriker.batStrikeRate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-1/2 pl-2 border-l border-gray-200">
                <h2 className="text-xs uppercase text-gray-500 mb-2">
                  BOWLING
                </h2>

                {/* Current Bowler */}
                <div className="mb-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="font-semibold text-sm">
                      {commentary?.miniscore?.bowlerStriker.bowlName}
                    </span>
                  </div>
                  <div className="flex mt-1 items-end">
                    <span className="text-lg font-bold mr-2">
                      {commentary?.miniscore?.bowlerStriker.bowlWkts}
                    </span>
                    <span className="text-xs text-gray-500">
                      /{commentary?.miniscore?.bowlerStriker.bowlRuns}
                    </span>
                  </div>
                  <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                    <span>
                      Ovs: {commentary?.miniscore?.bowlerStriker.bowlOvs}
                    </span>
                    <span>
                      Econ: {commentary?.miniscore?.bowlerStriker.bowlEcon}
                    </span>
                  </div>
                </div>

                {/* Other Bowler */}
                <div>
                  <div className="flex items-center">
                    <span className="text-sm">
                      {commentary?.miniscore.bowlerNonStriker.bowlName}
                    </span>
                  </div>
                  <div className="flex mt-1 items-end">
                    <span className="text-lg font-bold mr-2">
                      {commentary?.miniscore.bowlerNonStriker.bowlWkts}
                    </span>
                    <span className="text-xs text-gray-500">
                      /{commentary?.miniscore.bowlerNonStriker.bowlRuns}
                    </span>
                  </div>
                  <div className="flex text-xs text-gray-600 mt-1 space-x-2">
                    <span>
                      Ovs: {commentary?.miniscore.bowlerNonStriker.bowlOvs}
                    </span>
                    <span>
                      Econ: {commentary?.miniscore.bowlerNonStriker.bowlEcon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commentary section */}
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <h2 className="text-xs uppercase text-gray-500 mb-2 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              LIVE COMMENTARY
            </h2>
            <div className=" overflow-y-auto">
              {commentary?.commentaryList?.slice(0, 5).map((e, i) => (
                <div
                  className={`text-sm py-2 h-36 overflow-auto ${
                    i !== 0 ? "border-t border-gray-200" : ""
                  }`}
                  key={i}
                >
                  {e?.commText}
                </div>
              ))}
            </div>
          </div>
        </div>

        {data?.matchInfo && (
          <div className="w-2/3 border bg-white rounded-lg shadow-lg border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 mb-3">
                  {commentary?.matchHeader?.seriesName} -{" "}
                  {commentary?.matchHeader?.matchDescription}
                </div>
                {/* Venue information */}
                <div className="flex items-center mb-3 text-xs text-gray-600">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    {data?.matchInfo?.venue?.name},{" "}
                    {data?.mathcInfo?.venue?.city},{" "}
                    {data?.matchInfo?.venue?.country}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-sm">{data?.matchInfo?.team1.name}</span>
                </div>
                <span className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team1.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}{" "}
                      ({score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}{" "}
                      ({score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-400 mr-2 text-sm" />
                  <span className="text-sm">{data.matchInfo.team2.name}</span>
                </div>
                <span className="text-sm">
                  {score?.scorecard?.[0]?.batTeamName ===
                  data?.matchInfo?.team2.name ? (
                    <span>
                      {score?.scorecard[0].score}/{score?.scorecard[0].wickets}{" "}
                      ({score?.scorecard[0].overs})
                    </span>
                  ) : score?.scorecard?.[1] ? (
                    <span>
                      {score?.scorecard[1].score}/{score?.scorecard[1].wickets}{" "}
                      ({score?.scorecard[1].overs})
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-xs mb-1">{data.matchInfo.status}</div>
                <div className=" text-green-500 font-medium text-lg mb-1">
                  {data.matchInfo.shortStatus}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 text-xs font-medium cursor-pointer ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            {activeTab === "Info" ? renderInfoTab() : renderSquadsTab()}
          </div>
        )}

        <div className="w-1/4">
          <TopNews />
        </div>
      </div>

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

        <div className="flex justify-center space-x-1 mt-6 mb-4">
          <span className="text-xl text-gray-500">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
          <span className="text-xl text-gray-300">•</span>
        </div>

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
