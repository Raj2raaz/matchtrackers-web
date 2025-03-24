import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { CgChevronDoubleDown, CgChevronDoubleUp } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import team from "../assets/team.png";
import headingPost from "../assets/headingpost.png";
import headingPost2 from "../assets/headingpost2.png";
import featuredVid1 from "../assets/featuredVid1.png";
import featuredVid2 from "../assets/featuredVid2.png";
import blogs1 from "../assets/blogs1.png";
import blogs2 from "../assets/blogs2.png";
import blogs3 from "../assets/blogs3.png";
import blogs4 from "../assets/blogs4.png";
import volleyballPoster from "../assets/volleyballPoster.png";
import { LiaTrophySolid } from "react-icons/lia";
import Footer from "../components/Footer";
import useCricbuzzStore from "../store/mainStore";
import Image from "../components/Image";
import { useNavigate } from "react-router-dom";
import TrendingPlayers from "../components/TrendingPlayers";
import EditorPicks from "../components/EditorPicks";
import Gallery from "../components/Gallery";

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
        <div className="w-full md:w-auto flex-grow border bg-white border-gray-400 rounded flex gap-2 items-center px-2 py-2">
          <input
            type="text"
            placeholder="Search for Sports"
            className="outline-none w-full"
          />
          <CiSearch size={23} className="text-gray-400" />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-5 mt-2 sm:mt-0">
          {sports.map((e, i) => (
            <p
              key={i}
              className="px-3 py-0.5 text-sm border-2 font-medium border-primary rounded"
            >
              {e}
            </p>
          ))}
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
              ) : recentMatches && recentMatches.length > 0 ? (
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
                <p className="text-gray-500 italic">No matches available</p>
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
            ) : liveMatches && liveMatches.length > 0 ? (
              liveMatches.slice(0, 5).map((e, i) => (
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
                      onClick={() => navigate("/match/" + e.matchInfo.matchId)}
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
                        View Series <FaChevronRight size={10} />{" "}
                      </button>
                    </div>
                  )}
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
          <div className="flex justify-between">
            <p className="text-lg font-bold">Trending Now in Sports</p>
            <p className="flex text-sm gap-2 items-center cursor-pointer">
              See All <FaChevronRight size={12} />
            </p>
          </div>
          <div>
            {isLoading ? (
              <Placeholder type="image" />
            ) : (
              <img src={team} className="mt-2 w-full object-cover" alt="Team" />
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
                <img
                  src={headingPost}
                  alt="Heading Post"
                  className="w-full object-cover"
                />
                <div className="mt-2 px-2">
                  <h1 className="font-bold text-xl text-primary">
                    Heading about the Highlighted Post goes here
                  </h1>
                  <div className="flex flex-col md:flex-row md:gap-10 items-start md:items-end">
                    <p className="mt-1 font-medium text-gray-400">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Enim qui quidem distinctio minima, ea maxime quod ipsum ut
                      ex laudantium laboriosam rerum nisi culpa doloremque iusto
                      modi placeat sed perferendis. Lorem, ipsum dolor sit amet
                      consectetur adipisicing elit. Laudantium minima
                      accusantium
                    </p>
                    <button className="mt-3 md:mt-0 text-nowrap px-3 py-1 items-center font-medium bg-primary rounded flex gap-6 text-white">
                      View Match Higlights <FaChevronRight />{" "}
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
                <img
                  src={headingPost2}
                  alt="Heading Post 2"
                  className="w-full object-cover"
                />
                <div className="mt-2 px-2">
                  <h1 className="font-bold text-xl text-primary">
                    Heading about the Highlighted Post goes here
                  </h1>
                  <div className="flex flex-col md:flex-row md:gap-10 items-start md:items-end">
                    <p className="mt-1 font-medium text-gray-400">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Enim qui quidem distinctio minima, ea maxime quod ipsum ut
                      ex laudantium laboriosam rerum nisi culpa doloremque iusto
                      modi placeat sed perferendis. Lorem, ipsum dolor sit amet
                      consectetur adipisicing elit. Laudantium minima
                      accusantium
                    </p>
                    <button className="mt-3 md:mt-0 text-nowrap px-3 py-1 items-center font-medium bg-primary rounded flex gap-6 text-white">
                      View Match Higlights <FaChevronRight />{" "}
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
          <p className="flex text-sm gap-2 items-center cursor-pointer">
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
          <h1 className="text-xl font-bold text-primary">Blogs</h1>
          <p className="flex text-sm gap-2 items-center cursor-pointer">
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
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
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
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
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
      <Gallery id={2} isLoading={isLoading} />
    </div>
  );
}
