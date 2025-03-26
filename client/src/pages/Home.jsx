import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { CgChevronDoubleDown, CgChevronDoubleUp } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import team from "../assets/team.png";
import headingPost from "../assets/headingpost.png";
import headingPost2 from "../assets/headingpost2.png";
import volleyballPoster from "../assets/volleyballPoster.png";
import { LiaTrophySolid } from "react-icons/lia";
import useCricbuzzStore from "../store/cricket";
import Image from "../components/Image";
import { useNavigate } from "react-router-dom";
import TrendingPlayers from "../components/TrendingPlayers";
import EditorPicks from "../components/EditorPicks";
import Gallery from "../components/Gallery";
import useFootballStore from "../store/football";
import { getFixtures, getLeagues } from "../api/Football";
import ipl from "../assets/ipl.jpg";

function generateMatchSummary(matchData) {
  /**
   * Generates a short paragraph summarizing the cricket match.
   *
   * @param {object} matchData - A dictionary containing match information.
   * @returns {string} - A string containing the match summary.
   */

  const matchInfo = matchData.matchInfo;
  const matchScore = matchData.matchScore;
  const commentary = matchData.commentary.commentaryList;

  const team1Name = matchInfo.team1.teamName;
  const team2Name = matchInfo.team2.teamName;
  const team1Score = matchScore.team1Score.inngs1.runs;
  const team2Score = matchScore.team2Score.inngs1.runs;
  const team1Wickets = matchScore.team1Score.inngs1.wickets;
  const team2Wickets = matchScore.team2Score.inngs1.wickets;
  const team1Overs = matchScore.team1Score.inngs1.overs;
  const team2Overs = matchScore.team2Score.inngs1.overs;

  const venue = matchInfo.venueInfo.ground;
  const city = matchInfo.venueInfo.city;
  const status = matchInfo.status;
  const playerOfTheMatch =
    matchData.commentary.matchHeader.playersOfTheMatch[0].name;

  let summary = `In a thrilling T20 encounter at ${venue}, ${city}, the ${matchInfo.seriesName} witnessed a high-scoring clash between ${team1Name} and ${team2Name}. `;
  summary += `${team1Name} posted a formidable total of ${team1Score}/${team1Wickets} in ${team1Overs} overs. `;
  summary += `${team2Name} fought valiantly, chasing the target, and managed to score ${team2Score}/${team2Wickets} in ${team2Overs} overs. `;
  summary += `Ultimately, ${team1Name} emerged victorious, winning by 11 runs. `;
  summary += `The match saw some crucial moments, including ${playerOfTheMatch}'s outstanding performance, earning him the Player of the Match award. ${status}. `;

  return summary;
}

const sports = ["Cricket", "Football"];

// Placeholder component for different UI elements
const Placeholder = ({ type, count = 1 }) => {
  // Different placeholder types
  const types = {
    rectangle: "h-32 w-full rounded-md animate-pulse bg-gray-200",
    circle: "h-10 w-10 rounded-full animate-pulse bg-gray-200",
    line: "h-4 w-full rounded-md animate-pulse bg-gray-200 my-2",
    smallLine: "h-3 w-24 rounded-md animate-pulse bg-gray-200 my-1",
    card: "h-48 w-full rounded-md animate-pulse bg-gray-200",
    image: "h-64 w-full rounded-md animate-pulse bg-gray-200",
    matchCard: "p-5 bg-white shadow-lg mt-4 rounded-lg border border-[#E6E6E6]",
  };

  if (type === "matchCard") {
    return (
      <div className={types.matchCard}>
        <div className="flex justify-between">
          <div className="h-4 w-32 rounded-md animate-pulse bg-gray-200"></div>
          <div className="h-4 w-16 rounded-md animate-pulse bg-gray-200"></div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full animate-pulse bg-gray-200"></div>
            <div className="h-4 w-16 rounded-md animate-pulse bg-gray-200"></div>
          </div>
          <div className="h-4 w-4 rounded-md animate-pulse bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full animate-pulse bg-gray-200"></div>
            <div className="h-4 w-16 rounded-md animate-pulse bg-gray-200"></div>
          </div>
        </div>
        <div className="h-8 w-full rounded-md animate-pulse bg-gray-200 mt-3"></div>
      </div>
    );
  }

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={types[type]} />
      ))}
    </>
  );
};

export default function Home() {
  const {
    recentMatches,
    trendingPlayers,
    fetchData,
    liveMatches,
    editorPicks,
    galleries,
    news,
  } = useCricbuzzStore();

  const [noOfRecentMatches, setNoOfRecentMatches] = useState(7);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [content, setContent] = useState("cricket");
  const [fbLeagues, setfbLeagues] = useState([]);
  const [fbFixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const leagues = await getLeagues();
      const fixtures = await getFixtures();

      setfbLeagues(leagues);
      setFixtures(fixtures);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    };

    loadData();
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* search section */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-5 mt-2 sm:mt-0">
          {sports.map((e, i) => (
            <p
              key={i}
              onClick={() => setContent(e.toLowerCase())}
              className={`px-3 py-0.5 text-sm border-2 ${
                content === e.toLowerCase()
                  ? "bg-primary text-white"
                  : "bg-none"
              } font-medium cursor-pointer border-primary rounded`}
            >
              {e}
            </p>
          ))}
        </div>
        <div className="w-full md:w-auto flex-grow border bg-white border-gray-400 rounded flex gap-2 items-center px-2 py-2">
          <input
            type="text"
            placeholder="Search for Sports"
            className="outline-none w-full"
          />
          <CiSearch size={23} className="text-gray-400" />
        </div>
      </div>

      {/* main Section */}
      <div className="flex flex-col lg:flex-row items-start mt-7 gap-6 h-full">
        <div className="w-full lg:w-[37%]">
          <div className="bg-white shadow-lg rounded-lg border border-[#E6E6E6] p-5">
            <h1 className="text-sub font-semibold text-xl">
              Recent Highlights
            </h1>
            <div className="text-sm mt-4 text-primary">
              {isLoading ? (
                <Placeholder type="line" count={5} />
              ) : content === "cricket" ? (
                recentMatches && recentMatches.length > 0 ? (
                  recentMatches.slice(0, noOfRecentMatches).map((e, i) =>
                    e.seriesAdWrapper ? (
                      <div
                        onClick={() =>
                          navigate("/schedules/" + e.seriesAdWrapper.seriesId)
                        }
                        key={i}
                        className="bg-gray-200 hover:bg-gray-300 cursor-pointer items-center flex justify-between mt-2 pl-3 pr-1.5 py-1.5 rounded-full"
                      >
                        <p className="truncate max-w-[14rem] overflow-hidden whitespace-nowrap">
                          {e.seriesAdWrapper.seriesName}
                        </p>
                        <IoMdArrowDroprightCircle size={26} />
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-gray-500 italic">
                    No recent matches available
                  </p>
                )
              ) : fbLeagues && fbLeagues.length > 0 ? (
                fbLeagues.slice(0, noOfRecentMatches).map((e, i) => (
                  <div
                    key={i}
                    onClick={() => navigate("/leagues/" + e.id)}
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer items-center flex justify-between mt-2 pl-3 pr-1.5 py-1.5 rounded-full"
                  >
                    <p className="truncate flex items-center gap-4 max-w-[14rem] overflow-hidden whitespace-nowrap">
                      <img
                        src={e.league.logo}
                        className="h-8 w-8 rounded-full object-cover"
                        alt=""
                      />
                      {e.league.name}
                    </p>
                    <IoMdArrowDroprightCircle size={26} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No leagues available</p>
              )}
            </div>
            {!isLoading && recentMatches && recentMatches.length > 0 && (
              <button
                onClick={() => {
                  if (noOfRecentMatches < recentMatches.length) {
                    setNoOfRecentMatches(noOfRecentMatches + 5);
                  } else setNoOfRecentMatches(7);
                }}
                className="flex cursor-pointer mx-auto mt-2 text-sm font-medium items-end"
              >
                {noOfRecentMatches >= recentMatches.length
                  ? "See Less"
                  : "See More"}{" "}
                {noOfRecentMatches >= recentMatches.length ? (
                  <CgChevronDoubleUp size={15} />
                ) : (
                  <CgChevronDoubleDown size={15} />
                )}
              </button>
            )}
          </div>

          <div className="mt-5">
            {isLoading ? (
              <>
                <Placeholder type="matchCard" />
                <Placeholder type="matchCard" />
                <Placeholder type="matchCard" />
              </>
            ) : content === "cricket" ? (
              liveMatches && liveMatches.length > 0 ? (
                liveMatches.map((e, i) => (
                  <div
                    key={i}
                    className="bg-white shadow-lg mt-4 rounded-lg border border-[#E6E6E6] p-5"
                  >
                    <div className="flex text-sm justify-between">
                      <p className="font-semibold max-w-[13rem] truncate text-sub">
                        {e.matchInfo.matchFormat} Match //{" "}
                        {e.matchInfo.venueInfo.ground}
                      </p>
                      <p
                        className={`px-3 py-0.5 flex items-center font-medium rounded-full ${
                          e.matchInfo.state === "In Progress"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {e.matchInfo.state}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center font-bold text-lg gap-1">
                          <Image
                            faceImageId={e.matchInfo.team1.imageId}
                            className="w-7 h-7 rounded-full"
                          />
                          {e.matchInfo.team1.teamSName}
                        </div>
                        <p className="text-sm mt-0.5 text-primary">
                          {e?.matchScore?.team1Score?.inngs1?.runs || 0}/
                          {e?.matchScore?.team1Score?.inngs1?.wickets || 0} (
                          {e?.matchScore?.team1Score?.inngs1?.overs || 0})
                        </p>
                      </div>
                      <p className="font-bold text-gray-400 text-lg">vs</p>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center font-bold text-lg gap-1">
                          <Image
                            faceImageId={e.matchInfo.team2.imageId}
                            className="w-7 h-7 rounded-full"
                          />
                          {e.matchInfo.team2.teamSName}
                        </div>
                        <p className="text-sm mt-0.5 text-primary">
                          {e?.matchScore?.team2Score?.inngs1?.runs || 0}/
                          {e?.matchScore?.team2Score?.inngs1?.wickets || 0} (
                          {e?.matchScore?.team2Score?.inngs1?.overs || 0})
                        </p>
                      </div>
                    </div>
                    {e.matchInfo.state === "In Progress" ? (
                      <button
                        onClick={() =>
                          navigate("/match/" + e.matchInfo.matchId)
                        }
                        className="bg-primary text-white py-1 rounded mt-2.5 font-semibold text-center w-full"
                      >
                        See live updates
                      </button>
                    ) : (
                      <div className="flex justify-between pt-1 mt-2.5 border-t border-dashed border-gray-400">
                        <button
                          onClick={() =>
                            navigate("/match/" + e.matchInfo.matchId)
                          }
                          className="flex items-center cursor-pointer gap-2"
                        >
                          See Updates <FaChevronRight size={10} />
                        </button>
                        <button
                          onClick={() =>
                            navigate("/schedules/" + e.matchInfo.seriesId)
                          }
                          className="flex items-center cursor-pointer gap-2"
                        >
                          View Series <FaChevronRight size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center mt-4">
                  No live cricket matches available
                </p>
              )
            ) : fbFixtures.length > 0 ? (
              fbFixtures.map((e, i) => (
                <div
                  key={i}
                  className="bg-white shadow-lg mt-4 rounded-lg border border-[#E6E6E6] p-5"
                >
                  <div className="flex text-sm justify-between">
                    <p className="font-semibold max-w-[13rem] truncate text-sub">
                      {e.league.name} Match // {e.fixture.venue.name}
                    </p>
                    <p
                      className={`px-3 py-0.5 flex items-center font-medium rounded-full ${
                        ["1H", "2H", "ET", "PEN"].includes(
                          e.fixture.status.short
                        ) && e.fixture.status.elapsed > 0
                          ? "bg-red-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {["1H", "2H", "ET", "PEN"].includes(
                        e.fixture.status.short
                      ) && e.fixture.status.elapsed > 0
                        ? "Live"
                        : new Date(e.fixture.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center font-bold text-lg gap-1">
                        <img
                          src={e.teams.home.logo}
                          className="h-7 w-7 rounded-full object-contain"
                          alt=""
                        />
                        {e.teams.home.name}
                      </div>
                      <p className="text-xl font-bold ml-4 mt-0.5 text-primary">
                        {e.goals.home}
                      </p>
                    </div>
                    <p className="font-bold text-gray-400 text-lg">vs</p>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center font-bold text-lg gap-1">
                        <img
                          src={e.teams.away.logo}
                          className="h-7 w-7 rounded-full object-contain"
                          alt=""
                        />
                        {e.teams.away.name}
                      </div>
                      <p className="text-xl font-bold mr-4 mt-0.5 text-primary">
                        {e.goals.away}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/match/" + e.matchInfo.matchId)}
                    className="bg-primary text-white py-1 rounded mt-2.5 font-semibold text-center w-full"
                  >
                    See live updates
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center mt-4">
                No live matches available
              </p>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[63%] mt-6 lg:mt-0">
          <div>
            {isLoading ? (
              <Placeholder type="image" />
            ) : (
              <div className="relative w-full  overflow-hidden rounded-lg">
                <img
                  src={ipl}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  alt="Team"
                />
              </div>
            )}
          </div>
          <div className="mt-3 p-3 shadow-lg rounded-lg border-[#E6E6E6] bg-white">
            {isLoading ? (
              <>
                <Placeholder type="image" />
                <Placeholder type="line" count={3} />
              </>
            ) : (
              <>
                <Image
                  faceImageId={liveMatches[0].commentary.matchVideos[0].imageId}
                  resolution="de"
                  className="h-[20rem] w-full "
                />
                <div className="space-y-3 p-2">
                  <h1 className="text-2xl font-bold text-primary tracking-tight">
                    {liveMatches[0].matchInfo.seriesName} (
                    {liveMatches[0].matchInfo.team1.teamName} -
                    {liveMatches[0].matchInfo.team2.teamName})
                  </h1>
                  <div className="flex flex-col space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {generateMatchSummary(liveMatches[0])}
                    </p>
                    <button
                      onClick={() =>
                        navigate("/match/" + liveMatches[0].matchInfo.matchId)
                      }
                      className="flex items-center  w-fit mt-2 justify-center 
          text-white bg-primary 
          px-4 py-2 
          rounded-lg 
          hover:bg-opacity-90 
          transition-colors 
          space-x-2
          self-start md:self-auto"
                    >
                      <span>View Match Highlights</span>
                      <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-3 p-3 shadow-lg rounded-lg border-[#E6E6E6] bg-white">
            {isLoading ? (
              <>
                <Placeholder type="image" />
                <Placeholder type="line" count={3} />
              </>
            ) : (
              <>
                <Image
                  faceImageId={liveMatches[1].commentary.matchVideos[0].imageId}
                  resolution="de"
                  className="h-[20rem] w-full "
                />

                <div className="space-y-3 p-2">
                  <h1 className="text-2xl font-bold text-primary tracking-tight">
                    {liveMatches[1].matchInfo.seriesName} (
                    {liveMatches[1].matchInfo.team1.teamName} -
                    {liveMatches[1].matchInfo.team2.teamName})
                  </h1>
                  <div className="flex flex-col space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {generateMatchSummary(liveMatches[1])}
                    </p>
                    <button
                      onClick={() =>
                        navigate("/match/" + liveMatches[1].matchInfo.matchId)
                      }
                      className="flex items-center  w-fit mt-2 justify-center 
          text-white bg-primary 
          px-4 py-2 
          rounded-lg 
          hover:bg-opacity-90 
          transition-colors 
          space-x-2
          self-start md:self-auto"
                    >
                      <span>View Match Highlights</span>
                      <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* videos section */}
      <div className="p-4 bg-white border mt-6 shadow border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">
            {isLoading
              ? "Gallery Photos"
              : galleries && galleries[0]?.headline
              ? galleries[0]?.headline + " Photos"
              : "Gallery Photos"}
          </h1>
          <p
            onClick={() => navigate("/gallery")}
            className="flex text-sm gap-2 items-center cursor-pointer"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar whitespace-nowrap px-4">
          {isLoading ? (
            <>
              <div className="shrink-0 w-[300px] sm:w-[23vw]">
                <Placeholder type="image" />
              </div>
              <div className="shrink-0 w-[300px] sm:w-[23vw]">
                <Placeholder type="image" />
              </div>
              <div className="shrink-0 w-[300px] sm:w-[23vw]">
                <Placeholder type="image" />
              </div>
            </>
          ) : galleries &&
            galleries[0]?.images &&
            galleries[0]?.images.length > 0 ? (
            galleries[0]?.images.map((e, i) => (
              <div key={i} className="shrink-0 w-[300px] sm:w-[23vw]">
                <Image
                  faceImageId={e}
                  className="w-full h-full"
                  resolution="de"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No gallery images available</p>
          )}
        </div>
      </div>

      {/* blogs section */}
      <div className="p-4 bg-white border mt-6 shadow border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">LATEST NEWS</h1>
          <p
            onClick={() => navigate("/all-news")}
            className="flex text-sm gap-2 items-center cursor-pointer"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mt-5">
          <div className="w-full lg:w-1/2 flex flex-col gap-10">
            {isLoading ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <Placeholder type="image" />
                  <div className="mt-3 sm:mt-0 w-full">
                    <Placeholder type="line" count={4} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <Placeholder type="image" />
                  <div className="mt-3 sm:mt-0 w-full">
                    <Placeholder type="line" count={4} />
                  </div>
                </div>
              </>
            ) : news && news.length > 0 ? (
              news.slice(0, 3).map((e, i) =>
                e.story ? (
                  <div
                    key={i}
                    onClick={() => navigate("/news/" + e.story?.id)}
                    className="flex cursor-pointer flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <Image
                      faceImageId={e?.story?.imageId}
                      className="h-auto w-full sm:h-54 sm:w-72"
                      resolution="de"
                    />
                    <div className="mt-3 sm:mt-0">
                      <p className="text-xl sm:text-2xl font-bold ">
                        {e?.story?.hline}
                      </p>
                      <p className="line-clamp-3 overflow-hidden text-ellipsis">
                        {e?.story?.intro}
                      </p>
                      <div className="flex mt-2 items-center gap-2 flex-wrap">
                        <p>By {e?.story?.coverImage?.source || "Unknown"}</p>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                        <p className="text-gray-400">
                          {new Date(
                            Number(e?.story?.pubTime || Date.now())
                          ).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <p className="text-gray-500 italic">No blog posts available</p>
            )}
          </div>
          <div
            onClick={() => navigate("/news/" + news[4]?.story.id)}
            className="w-full cursor-pointer lg:w-1/2 mt-6 lg:mt-0"
          >
            {isLoading ? (
              <>
                <Placeholder type="image" />
                <Placeholder type="line" count={4} />
              </>
            ) : news && news.length > 4 && news[4]?.story ? (
              <>
                <Image
                  faceImageId={news[4]?.story?.imageId}
                  className="w-full"
                  resolution="de"
                />
                <p className="text-2xl sm:text-4xl px-3 mt-2 font-bold">
                  {news[4]?.story?.hline}
                </p>
                <p className="px-3 mt-2">{news[4]?.story?.intro}</p>
                <div className="flex mt-2 mx-3 items-center gap-2 flex-wrap">
                  <p>By {news[4]?.story?.coverImage?.source || "Unknown"}</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                  <p className="text-gray-400">
                    {new Date(
                      Number(news[4]?.story?.pubTime || Date.now())
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">
                Featured blog post not available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-2/3">
          {/* trending players */}
          <TrendingPlayers isLoading={isLoading} />

          {/* match coverage */}
          <div className="bg-white mt-5 border p-4 border-[#e6e6e6] w-full max-w-full overflow-hidden">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              Match Coverage
            </h1>
            {isLoading ? (
              <>
                <Placeholder type="line" />
                <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-5">
                  <div className="w-full">
                    <Placeholder type="line" count={6} />
                  </div>
                </div>
              </>
            ) : liveMatches && liveMatches.length > 0 ? (
              <>
                <div className="flex gap-4 sm:gap-6 md:gap-10 items-center whitespace-nowrap border-b border-gray-200 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                  {liveMatches.map((e, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedMatch(i)}
                      className={`min-w-[6rem] sm:min-w-[7rem] text-center flex-shrink-0 ${
                        selectedMatch === i ? "text-blue-500" : ""
                      } focus:text-blue-500 cursor-pointer hover:text-blue-500 transition-colors duration-200`}
                    >
                      <p className="font-bold text-sm sm:text-base">
                        {e?.matchInfo?.team1?.teamSName}{" "}
                        <span className="text-xs">VS</span>{" "}
                        {e?.matchInfo?.team2?.teamSName}
                      </p>
                      <p className="text-xs sm:text-sm">
                        {e?.matchInfo.matchFormat}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row gap-5 md:gap-10 mt-5">
                  <div className="w-full">
                    <h1 className="text-lg sm:text-xl md:text-2xl flex flex-wrap gap-4 items-center font-bold">
                      {liveMatches[selectedMatch]?.matchInfo.team1 && (
                        <Image
                          faceImageId={
                            liveMatches[selectedMatch]?.matchInfo.team1
                              .teamSName ===
                            liveMatches[
                              selectedMatch
                            ]?.matchInfo.stateTitle?.split(" ")[0]
                              ? liveMatches[selectedMatch]?.matchInfo.team1
                                  .imageId
                              : liveMatches[selectedMatch]?.matchInfo.team2
                                  .imageId
                          }
                          className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full"
                          resolution=""
                        />
                      )}
                      <span className="block w-full md:w-auto text-sm sm:text-base md:text-lg line-clamp-2">
                        {liveMatches &&
                          liveMatches[selectedMatch]?.commentary?.miniscore
                            ?.lastWicket}
                      </span>
                    </h1>
                    <p className="flex my-3 bg-blue-100 px-2 p-1 items-center justify-between rounded text-sm sm:text-base">
                      <span className="flex gap-2 sm:gap-3 items-center overflow-hidden">
                        <LiaTrophySolid className="text-blue-500 flex-shrink-0" />
                        <p className="font-bold truncate">
                          {
                            liveMatches[selectedMatch]?.matchInfo?.team1
                              ?.teamSName
                          }{" "}
                          <span className="text-xs">VS</span>{" "}
                          {
                            liveMatches[selectedMatch]?.matchInfo?.team2
                              ?.teamSName
                          }
                        </p>{" "}
                        <span className="truncate">
                          {liveMatches[selectedMatch]?.matchInfo?.status}
                        </span>
                      </span>
                      <FaChevronRight
                        className="text-blue-500 flex-shrink-0"
                        size={12}
                      />
                    </p>
                    {liveMatches[selectedMatch]?.commentary?.commentaryList
                      ?.slice(2, 6)
                      .map(
                        (e, i) =>
                          e?.commText &&
                          e?.commText.length > 5 && (
                            <p
                              key={i}
                              className="flex py-1 font-medium items-start gap-2 text-sm sm:text-base"
                            >
                              <FaChevronRight
                                className="text-blue-400 flex-shrink-0 mt-1"
                                size={13}
                              />{" "}
                              <span className="line-clamp-2">
                                {e?.commText.replace("B0$", "")}
                              </span>
                            </p>
                          )
                      )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic mt-3">
                No match coverage available
              </p>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
          {isLoading ? (
            <Placeholder type="image" />
          ) : (
            <img
              src={volleyballPoster}
              alt="Volleyball Poster"
              className="w-full"
            />
          )}
        </div>
      </div>

      {/* editors picks */}
      <EditorPicks isLoading={isLoading} />

      {/* Gallery */}
      <Gallery id={1} isLoading={isLoading} />
    </div>
  );
}
