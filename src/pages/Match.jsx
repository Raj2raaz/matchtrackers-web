import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaMapMarkerAlt,
} from "react-icons/fa";
import TrendingPlayers from "../components/TrendingPlayers";
import volleyballPoster from "../assets/volleyballPoster.png";
import TopNewsSeriesTable from "../components/TopNewsSeriesTable";
import { useParams } from "react-router-dom";
import apiClient from "../utils/axios";
import Image from "../components/Image";

const Match = () => {
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
  const [activeTab, setActiveTab] = useState("Info");
  const [venueInfo, setVenueInfo] = useState({
    id: 31,
    name: "Eden Gardens",
    city: "Kolkata",
    country: "India",
    timezone: "+05:30",
    latitude: "22.564527",
    longitude: "88.343247",
  });
  const [teamSquads, setTeamSquads] = useState({
    team1: null,
    team2: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchResponse, scoreResponse] = await Promise.all([
          apiClient.get(`/mcenter/v1/${id}`),
          apiClient.get(`/mcenter/v1/${id}/scard`),
        ]);

        setData(matchResponse.data);
        setScore(scoreResponse.data);

        // In a real app, you would fetch venue data here
        // For now, we're using the static venue data you provided

        // Fetch team squads - in a real app, you'd need to call the proper API endpoints
        // Here we're using the squad data you provided as an example for KKR
        const kkrSquad = {
          id: 63,
          name: "Kolkata Knight Riders",
          playerDetails: [
            {
              id: 8520,
              name: "de Kock",
              fullName: "Quinton de Kock",
              nickName: "de Kock",
              captain: false,
              role: "WK-Batsman",
              keeper: true,
              substitute: false,
              teamId: 63,
              battingStyle: "LEFT",
              bowlingStyle: "",
              teamName: "KKR",
              faceImageId: 594326,
              isOverseas: true,
            },
            // ... more players would be here
          ],
        };

        // For demo purposes, we're setting both teams to KKR
        // In a real implementation, you'd fetch both teams' data
        setTeamSquads({
          team1: kkrSquad,
          team2: kkrSquad,
        });
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
    // Using the KKR squad data from your provided JSON for both teams as an example
    // In a real app, you would have proper data for both teams

    const squad = {
      id: 63,
      name: "Kolkata Knight Riders",
      playerDetails: [
        {
          id: 8520,
          name: "de Kock",
          fullName: "Quinton de Kock",
          nickName: "de Kock",
          captain: false,
          role: "WK-Batsman",
          keeper: true,
          substitute: false,
          teamId: 63,
          battingStyle: "LEFT",
          bowlingStyle: "",
          teamName: "KKR",
          faceImageId: 594326,
          isOverseas: true,
        },
        {
          id: 10917,
          name: "Venkatesh Iyer",
          fullName: "Venkatesh Iyer",
          nickName: "Venkatesh Iyer",
          captain: false,
          role: "Batting Allrounder",
          keeper: false,
          substitute: false,
          teamId: 63,
          battingStyle: "LEFT",
          bowlingStyle: "Right Arm medium",
          teamName: "KKR",
          faceImageId: 226278,
        },
        {
          id: 1447,
          name: "Ajinkya Rahane",
          fullName: "Ajinkya Rahane",
          nickName: "Rahane",
          captain: true,
          role: "Batsman",
          keeper: false,
          substitute: false,
          teamId: 63,
          battingStyle: "RIGHT",
          bowlingStyle: "Right Arm medium",
          teamName: "KKR",
          faceImageId: 332892,
        },
        {
          id: 10896,
          name: "Rinku Singh",
          fullName: "Rinku Singh",
          nickName: "Rinku Singh",
          captain: false,
          role: "Batsman",
          keeper: false,
          substitute: false,
          teamId: 63,
          battingStyle: "LEFT",
          bowlingStyle: "Right Arm off break",
          teamName: "KKR",
          faceImageId: 279125,
        },
        {
          id: 2276,
          name: "Narine",
          fullName: "Sunil Narine",
          nickName: "Narine",
          captain: false,
          role: "Bowling Allrounder",
          keeper: false,
          substitute: false,
          teamId: 63,
          battingStyle: "LEFT",
          bowlingStyle: "Right Arm off break",
          teamName: "KKR",
          faceImageId: 152654,
          isOverseas: true,
        },
        {
          id: 7736,
          name: "Russell",
          fullName: "Andre Russell",
          nickName: "Russell",
          captain: false,
          role: "Bowling Allrounder",
          keeper: false,
          substitute: false,
          teamId: 63,
          battingStyle: "RIGHT",
          bowlingStyle: "Right Arm fast",
          teamName: "KKR",
          faceImageId: 170821,
          isOverseas: true,
        },
      ],
    };

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
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <Image
                      faceImageId={player?.faceImageId}
                      className="h-7 w-7 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{player.fullName}</div>
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
                  key={`team2-${player.id}`}
                  className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium">{player.fullName}</div>
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
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
            <div>Batter</div>
            <div className="text-center">R</div>
            <div className="text-center">B</div>
            <div className="text-center">4s</div>
            <div className="text-center">6s</div>
            <div className="text-center">SR</div>
          </div>

          {getBatters(score?.scorecard[1]).map((batter, index) => (
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

        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-6 text-xs text-gray-500 mb-1">
            <div>Bowler</div>
            <div className="text-center">O</div>
            <div className="text-center">M</div>
            <div className="text-center">R</div>
            <div className="text-center">W</div>
            <div className="text-center">ECO</div>
          </div>

          {getBowlers(score?.scorecard[0]).map((bowler, index) => (
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

        <div className="p-4">
          {getBallCommentary(score?.scorecard[0]).map((ball, index) => (
            <div
              key={index}
              className={`pb-3 ${
                index < getBallCommentary(score?.scorecard[0]).length - 1
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
      </>
    );
  };

  return (
    <div className="mx-auto font-sans text-gray-800">
      <div className="flex gap-6">
        <div className="w-1/3 relative shadow-lg bg-white p-4 border border-gray-200 rounded-lg">
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

            <div className="bg-blue-600 text-white font-bold py-1 px-2 text-center text-sm">
              It's a SIX
            </div>

            <div className="bg-gray-100 text-xs p-2">
              The pressure is released. Legbreak spinning and right in the arc
            </div>

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

        {data?.matchInfo && (
          <div className="w-2/3 border bg-white rounded-lg shadow-lg border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="text-xs text-gray-500 mb-3">
                {data?.matchInfo?.series?.name} -{" "}
                {data?.matchInfo?.matchDescription}
              </div>

              {/* Venue information */}
              <div className="flex items-center mb-3 text-xs text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {venueInfo.name}, {venueInfo.city}, {venueInfo.country}
                </span>
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
              <div className="text-xs mb-1">{data.matchInfo.status}</div>
              <div className="text-xs mb-1">{data.matchInfo.shortStatus}</div>
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

        <TopNewsSeriesTable />
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
