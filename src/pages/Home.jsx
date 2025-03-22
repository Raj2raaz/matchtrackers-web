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

export default function Home() {
  const {
    recentMatches,
    trendingPlayers,
    fetchData,
    loading,
    error,
    liveMatches,
    editorPicks,
    galleries,
    news,
  } = useCricbuzzStore();

  const [noOfRecentMatches, setNoOfRecentMatches] = useState(7);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* search section   */}
      <div className="flex gap-3">
        <div className="md:w-2xl border bg-white border-gray-400 rounded flex gap-2 items-center px-2 py-2">
          <input
            type="text"
            placeholder="Search for Sports"
            className="outline-none w-full"
          />
          <CiSearch size={23} className="text-gray-400" />
        </div>
        <div className="flex items-center gap-5">
          {sports.map((e, i) => (
            <p className="px-3 py-0.5 text-sm border-2 font-medium border-primary rounded">
              {e}
            </p>
          ))}
        </div>
      </div>

      {/* main Section  */}
      <div className="flex items-start mt-7 gap-6 h-full">
        <div className="flex-[0.37] ">
          <div className=" bg-white shadow-lg rounded-lg border border-[#E6E6E6] p-5">
            <h1 className="text-sub  font-semibold text-xl">
              Recent Highlights
            </h1>
            <div className="text-sm mt-4 text-primary">
              {recentMatches.slice(0, noOfRecentMatches).map((e, i) =>
                e.seriesAdWrapper ? (
                  <div
                    key={i}
                    className="bg-gray-200 items-center flex justify-between mt-2 pl-3 pr-1.5 py-1.5 rounded-full"
                  >
                    <p className="truncate max-w-[14rem] overflow-hidden whitespace-nowrap">
                      {e.seriesAdWrapper.seriesName}
                    </p>
                    <IoMdArrowDroprightCircle size={26} />
                  </div>
                ) : null
              )}
            </div>
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
          </div>

          <div className="mt-5">
            {liveMatches?.map((e, i) => (
              <div
                key={i}
                className=" bg-white shadow-lg mt-4 rounded-lg border border-[#E6E6E6] p-5"
              >
                <div className="flex text-sm justify-between">
                  <p className="font-semibold max-w-[13rem] truncate text-sub">
                    {e.matchInfo.matchFormat} Match //{" "}
                    {e.matchInfo.venueInfo.ground}
                  </p>

                  <p
                    className={`px-3 py-0.5 flex items-center  font-medium rounded-full ${
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
                      {e?.matchScore?.team1Score?.inngs1?.runs}/
                      {e?.matchScore?.team1Score?.inngs1?.wickets} (
                      {e?.matchScore?.team1Score?.inngs1?.overs})
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
                      {e?.matchScore?.team2Score?.inngs1?.runs}/
                      {e?.matchScore?.team2Score?.inngs1?.wickets} (
                      {e?.matchScore?.team2Score?.inngs1?.overs})
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
                      onClick={() => navigate("/match/" + e.matchInfo.matchId)}
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
            ))}
          </div>
        </div>
        <div className="flex-1  ">
          <div className="flex justify-between">
            <p className="text-lg font-bold">Trending Now in Sports</p>
            <p className="flex text-sm gap-2 items-center">
              See All <FaChevronRight size={12} />
            </p>
          </div>
          <div>
            <img src={team} className="mt-2" alt="" />
          </div>
          <div className="mt-3 p-3 shadow-lg rounded-lg border-[#E6E6E6] bg-white ">
            <img src={headingPost} alt="" />
            <div className="mt-2 px-2">
              <h1 className="font-bold text-xl text-primary">
                Heading about the Highlighted Post goes here
              </h1>
              <div className="flex gap-10 items-end">
                <p className="mt-1 font-medium text-gray-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  qui quidem distinctio minima, ea maxime quod ipsum ut ex
                  laudantium laboriosam rerum nisi culpa doloremque iusto modi
                  placeat sed perferendis. Lorem, ipsum dolor sit amet
                  consectetur adipisicing elit. Laudantium minima accusantium
                </p>
                <button className=" text-nowrap px-3 py-1 items-center font-medium bg-primary rounded flex gap-6 text-white">
                  View Match Higlights <FaChevronRight />{" "}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 shadow-lg rounded-lg border-[#E6E6E6] bg-white ">
            <img src={headingPost2} alt="" />
            <div className="mt-2 px-2">
              <h1 className="font-bold text-xl text-primary">
                Heading about the Highlighted Post goes here
              </h1>
              <div className="flex gap-10 items-end">
                <p className="mt-1 font-medium text-gray-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                  qui quidem distinctio minima, ea maxime quod ipsum ut ex
                  laudantium laboriosam rerum nisi culpa doloremque iusto modi
                  placeat sed perferendis. Lorem, ipsum dolor sit amet
                  consectetur adipisicing elit. Laudantium minima accusantium
                </p>
                <button className=" text-nowrap px-3 py-1 items-center font-medium bg-primary rounded flex gap-6 text-white">
                  View Match Higlights <FaChevronRight />{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* videos section  */}
      <div className="p-4 bg-white border mt-6 shadow border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">
            {galleries[0]?.headline} Photos
          </h1>
          <p className="flex text-sm gap-2 items-center">
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar whitespace-nowrap px-4">
          {galleries[0]?.images.map((e, i) => (
            <div key={i} className="shrink-0 w-[23vw]">
              <Image
                faceImageId={e}
                className="w-full h-full"
                resolution="de"
              />
            </div>
          ))}
        </div>
      </div>

      {/* blogs section  */}
      <div className="p-4 bg-white border mt-6 shadow border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">Blogs</h1>
          <p className="flex text-sm gap-2 items-center">
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-16 mt-5">
          <div className="flex-1 flex flex-col gap-10">
            {news.slice(0, 3).map((e, i) =>
              e.story ? (
                <div key={i} className="flex items-center gap-5">
                  <Image
                    faceImageId={e?.story?.imageId}
                    className="h-54 w-72 "
                    resolution="de"
                  />
                  <div className="">
                    <p className="text-2xl font-bold ">{e?.story?.hline}</p>
                    <p className="line-clamp-3 overflow-hidden text-ellipsis">
                      {e?.story?.intro}
                    </p>
                    <div className="flex mt-2 items-center gap-2">
                      <p>By {e?.story?.coverImage?.source}</p>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                      <p className="text-gray-400">
                        {new Date(Number(e?.story?.pubTime)).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="flex-1">
            <Image
              faceImageId={news[4]?.story?.imageId}
              className="w-full "
              resolution="de"
            />
            <p className="text-4xl px-3 mt-2 font-bold">
              {news[4]?.story?.hline}
            </p>
            <p className="px-3 mt-2">{news[4]?.story?.intro}</p>
            <div className="flex mt-2 mx-3 items-center gap-2">
              <p>By {news[4]?.story?.coverImage?.source}</p>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
              <p className="text-gray-400">
                {new Date(Number(news[4]?.story?.pubTime)).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-5">
        <div className="w-2/3">
          {/* trending players  */}
          <TrendingPlayers />

          {/* match coverage  */}
          <div className="bg-white mt-5 border p-4 border-[#e6e6e6]">
            <h1 className="text-xl font-bold text-primary">Match Coverage</h1>
            <div className="flex gap-10 items-center whitespace-nowrap border-b border-gray-200 no-scrollbar mt-4 overflow-x-auto pb-2">
              {liveMatches.map((e, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMatch(i)}
                  className={`min-w-[7rem] text-center flex-shrink-0 ${
                    selectedMatch === i ? "text-blue-500" : ""
                  } focus:text-blue-500 cursor-pointer hover:text-blue-500 `}
                >
                  <p className="font-bold">
                    {e?.matchInfo?.team1?.teamSName}{" "}
                    <span className="text-xs">VS</span>{" "}
                    {e?.matchInfo?.team2?.teamSName}
                  </p>
                  <p className="text-sm">{e?.matchInfo.matchFormat}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-10 mt-5">
              <div className="flex-1">
                <h1 className="text-3xl flex w-[50rem] line-clamp-1 truncate gap-4 items-center font-bold">
                  {liveMatches &&
                    liveMatches[
                      selectedMatch
                    ]?.commentary[1]?.commText?.replace("B0$", "")}
                  <Image
                    faceImageId={
                      liveMatches[selectedMatch]?.matchInfo.team1.teamSName ===
                      liveMatches[selectedMatch]?.matchInfo.stateTitle.split(
                        " "
                      )[0]
                        ? liveMatches[selectedMatch]?.matchInfo.team1.imageId
                        : liveMatches[selectedMatch]?.matchInfo.team2.imageId
                    }
                    className="h-12 w-12 rounded-full"
                    resolution=""
                  />
                </h1>{" "}
                <p className="flex my-3 bg-blue-100 px-2 p-1 items-center justify-between rounded">
                  <span className="flex gap-3 items-center">
                    <LiaTrophySolid className="text-blue-500" />
                    <p className="font-bold">
                      {liveMatches[selectedMatch]?.matchInfo?.team1?.teamSName}{" "}
                      <span className="text-xs">VS</span>{" "}
                      {liveMatches[selectedMatch]?.matchInfo?.team2?.teamSName}
                    </p>{" "}
                    {liveMatches[selectedMatch]?.matchInfo?.status}
                  </span>
                  <FaChevronRight className="text-blue-500" size={12} />
                </p>
                {liveMatches[selectedMatch]?.commentary?.slice(2, 6).map(
                  (e, i) =>
                    e?.commText.length > 5 && (
                      <p
                        key={i}
                        className="flex w-[36rem] truncate  py-1 font-medium items-center gap-2"
                      >
                        <FaChevronRight className="text-blue-400 " size={13} />{" "}
                        {e?.commText.replace("B0$", "")}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <img src={volleyballPoster} alt="" className="w-full" />
        </div>
      </div>

      {/* editors picks  */}
      <EditorPicks />

      {/* Gallery  */}
      <Gallery />
    </div>
  );
}
