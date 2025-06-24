import React, { useEffect, useState } from "react";
import header from "../assets/Landing/header.webp";
import useCricbuzzStore from "../store/cricket";
import axios from "axios";
import {
  getAllSeriesList,
  getMatches,
  getNews,
  getRankings,
} from "../api/Home";
import Image from "../components/Image";
import Gallery from "../components/Gallery";
import {
  CgArrowRight,
  CgChevronDoubleDown,
  CgChevronDoubleUp,
} from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import ipl from "../assets/ipl.jpg";
import InterestingFactsCarousel from "../components/Facts";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function getReadableDate(timestampMs) {
  const inputDate = new Date(Number(timestampMs));
  const today = new Date();

  const normalize = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const input = normalize(inputDate);
  const now = normalize(today);

  const diffTime = input.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";

  const day = inputDate.getDate();
  const month = inputDate.toLocaleString("default", { month: "short" });

  return `${day}, ${month}`;
}

export default function Home() {
  const [selectedCat, setSelectedCat] = useState(1);
  const [recentMatches, setRecentMatches] = useState([]);
  const [topSectionMatches, setTopSectionMatches] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [seriesShown, setSeriesShown] = useState(9);
  const [playerRankings, setPlayerRankings] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);

  const initialPredictions = [
    { team: "India", percentage: 45 },
    { team: "Australia", percentage: 30 },
    { team: "England", percentage: 25 },
  ];
  const [predictions, setPredictions] = useState(initialPredictions);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  useEffect(() => {
    // Check localStorage for existing vote
    const votedIndex = localStorage.getItem("votedPrediction");

    if (votedIndex !== null) {
      setSelectedPrediction(Number(votedIndex));
      const updatedPredictions = [...predictions];
      updatedPredictions[Number(votedIndex)].percentage += 3; // Increase by 3% for the voted team
      setPredictions(updatedPredictions);
    }
  }, []);
  const handlePredictionClick = (index) => {
    if (selectedPrediction === null) {
      // Allow voting only if not already voted
      const newPredictions = [...predictions];
      const totalPercentage = newPredictions.reduce(
        (acc, curr) => acc + curr.percentage,
        0
      );
      const increaseAmount = 3;
      newPredictions[index].percentage += increaseAmount;
      // Decrease the others proportionally
      const decreaseAmount =
        (totalPercentage + increaseAmount - 100) / (newPredictions.length - 1);
      newPredictions.forEach((prediction, i) => {
        if (i !== index) {
          prediction.percentage -= decreaseAmount;
        }
      });
      setPredictions(newPredictions);
      setSelectedPrediction(index);
      localStorage.setItem("votedPrediction", index); // Store the vote in localStorage
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat]);

  const loadData = async () => {
    try {
      const rcMatches = await getMatches(
        selectedCat === 1 ? "live" : selectedCat === 2 ? "upcoming" : "recent"
      );
      setTopSectionMatches(rcMatches);
      const series = await getAllSeriesList();
      setSeriesList(series);
      const rankings = await getRankings("allrounders", "t20");
      setPlayerRankings(rankings);
      const upcoming = await getMatches("upcoming");
      setUpcomingMatches(upcoming);

      const blogResponse = await axios.get("/api/blog");
      setBlog(blogResponse.data.blogs);

      const news = await getNews();
      setNews(news);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Home | Match Trackers</title>
        <meta
          name="description"
          content="Latest cricket news, stats, and schedules."
        />
        <meta property="og:title" content="Home | Match Trackers" />
        <meta
          property="og:description"
          content="Get the latest cricket stats and updates."
        />
        <meta
          property="og:image"
          content="https://matchtrackers.com/favicon.svg"
        />
        <meta property="og:url" content="https://matchtrackers.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Match Trackers | Live Scores, Stats & News"
        />
        <meta
          name="twitter:description"
          content="Get updated with the latest scores, rankings and sports news."
        />
        <meta
          name="twitter:image"
          content="https://matchtrackers.com/favicon.svg"
        />
      </Helmet>

      <div className="relative">
        <img src={header} alt="" className="w-full h-auto" />
        <div className="absolute  bottom-0 h-[50%] bg-gradient-to-t from-[#002B5B] to-[#ffffff03] w-full">
          <div className="md:flex flex-col hidden  w-full gap-2 justify-end text-white py-5 h-full items-center">
            <p className="text-center">
              Experience the thrill of cricket like never before live scores,
              expert insights and match predictions, all in real time.
            </p>
            <div className="md:flex hidden gap-3 flex-wrap justify-center">
              {["News", "Analytics", "Highlights", "Matches"].map((e, i) => (
                <button
                  className="font-semibold border-2 px-4 py-1 rounded"
                  key={i}
                >
                  {e}
                </button>
              ))}
            </div>
            <button className="bg-white text-[#002b5b] mt-2 px-3 font-semibold rounded py-1">
              Join Now
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#002b5b] py-10">
        <div className="flex justify-center flex-wrap">
          {["Featured", "Live Score", "Upcoming", "Result"].map((e, i) => (
            <button
              key={i}
              className={`px-4 cursor-pointer py-1.5 text-xs md:text-sm ${
                selectedCat === i
                  ? "bg-blue-500 text-white"
                  : "bg-none text-white"
              } font-semibold rounded-lg `}
              onClick={() => setSelectedCat(i)}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar md:mx-10">
          {topSectionMatches.length > 0 &&
            topSectionMatches.map((e, i) => (
              <div key={i} className="min-w-[290px]">
                <div
                  onClick={() =>
                    navigate("/cricket/match/" + e.matchInfo.matchId)
                  }
                  className="bg-white z-20 h-36 relative cursor-pointer shadow-lg mt-4 rounded-xl border border-[#E6E6E6] p-5"
                >
                  <div className="flex text-sm items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-xs text-sub">
                          {e.matchInfo.matchDesc}
                        </p>
                        <div className="h-1 w-1 rounded-full bg-sub"></div>
                        <p className="font-semibold text-xs text-sub">
                          {e.matchInfo.matchFormat}
                        </p>
                      </div>
                      <p className="text-xs text-nowrap w-32 truncate">
                        {e?.matchInfo?.venueInfo?.ground}
                      </p>
                    </div>
                    <p
                      className={`px-3 py-1 text-nowrap text-xs flex items-center font-medium rounded-full ${
                        e.matchInfo.state === "In Progress"
                          ? "bg-red-500 text-white"
                          : e.matchInfo.state === "Complete"
                          ? "bg-green-600 text-white"
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
                        {e?.matchScore?.team1Score?.inngs1?.overs === 19.6
                          ? 20
                          : e?.matchScore?.team1Score?.inngs1?.overs || 0}
                        )
                      </p>
                      {e?.matchInfo?.stateTitle?.split(" ")[0] ===
                        e.matchInfo.team1.teamSName && (
                        <p className="text-green-600 text-sm font-semibold">
                          winner
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-center text-gray-400 text-lg">
                        vs
                      </p>
                      <p className="text-center bg-gray-200 rounded-full px-2 py-1 text-sm">
                        {getReadableDate(e.matchInfo.startDate)}
                      </p>
                    </div>
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
                        {e?.matchScore?.team2Score?.inngs1?.overs === 19.6
                          ? 20
                          : e?.matchScore?.team2Score?.inngs1?.overs || 0}
                        )
                      </p>
                      {e?.matchInfo?.stateTitle?.split(" ")[0] ===
                        e.matchInfo.team2.teamSName && (
                        <p className="text-green-600 text-sm font-semibold">
                          winner
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600 rounded-b-2xl z-0 -mt-3 p-2">
                  <div className="flex justify-between font-semibold px-3 text-xs mt-3 text-white items-center">
                    <button
                      onClick={() => {
                        navigate("/cricket/schedules/" + e.matchInfo.seriesId);
                      }}
                      className="cursor-pointer"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => {
                        navigate(
                          "/cricket/points-table/" + e.matchInfo.seriesId
                        );
                      }}
                      className="cursor-pointer"
                    >
                      Point Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 my-3 px-5 md:px-24">
        <div className="w-full md:w-1/3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-lg border border-[#E6E6E6] p-5">
            <h1 className="text-white font-semibold text-xl">
              Recent Highlights
            </h1>
            <div className="text-sm mt-4 text-primary">
              {seriesList && seriesList.length > 0 ? (
                seriesList.slice(0, seriesShown).map((e, i) => (
                  <div
                    onClick={() => navigate("/cricket/schedules/" + e.id)}
                    key={i}
                    className="bg-white hover:bg-gray-300 cursor-pointer items-center flex justify-between mt-2 pl-3 pr-1.5 py-1.5 rounded-full"
                  >
                    <p className="truncate max-w-[14rem] overflow-hidden whitespace-nowrap">
                      {e.name}
                    </p>
                    <IoMdArrowDroprightCircle size={26} />
                  </div>
                ))
              ) : (
                <p className="text-white italic">No recent matches available</p>
              )}
            </div>
            {seriesList && seriesList.length > 0 && (
              <button
                onClick={() => {
                  if (seriesShown < seriesList.length) {
                    setSeriesShown(seriesShown + 5);
                  } else setSeriesShown(7);
                }}
                className="flex text-white cursor-pointer mx-auto mt-2 text-sm font-medium items-end"
              >
                {seriesShown >= seriesList.length ? "See Less" : "See More"}{" "}
                {seriesShown >= seriesList.length ? (
                  <CgChevronDoubleUp size={15} />
                ) : (
                  <CgChevronDoubleDown size={15} />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <div className="relative w-full overflow-hidden rounded-lg">
            <img
              src={ipl}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              alt="Team"
            />
          </div>
          <div className=" flex md:flex-row flex-col gap-1 md:gap-10 my-2 font-semibold w-full ">
            <button className="bg-blue-700 flex-1 py-1.5 text-white rounded-lg">
              View Full Highlights
            </button>
            <button className="text-blue-700 flex-1 py-1.5 border-2 rounded-lg">
              View Match Summary
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 py-3 px-5 md:px-24">
        <div className="flex-1">
          <div className="bg-gray-200 border w-full border-slate-300 rounded-xl p-5">
            <h1 className="font-bold text-lg">Upcoming Fixtures</h1>
            <p className="text-sm">
              What's next in cricket -- match dates, venues and squads
            </p>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 mt-4 gap-y-2">
                {upcomingMatches.length > 0 &&
                  upcomingMatches.slice(0, 4).map((match, i) => (
                    <div
                      onClick={() =>
                        navigate("/cricket/match/" + match.matchInfo.matchId)
                      }
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer p-4"
                      key={i}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {match.matchInfo.matchDesc}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {match.matchInfo.matchFormat}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.matchInfo.state === "In Progress"
                              ? "bg-red-500 text-white"
                              : match.matchInfo.state === "Complete"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {match.matchInfo.state}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Image
                            faceImageId={match.matchInfo.team1.imageId}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {match.matchInfo.team1.teamSName}
                              </span>
                              {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                                match.matchInfo.team1.teamSName && (
                                <span className="text-green-600 text-xs font-medium">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {match?.matchScore?.team1Score?.inngs1?.runs || 0}
                              /
                              {match?.matchScore?.team1Score?.inngs1?.wickets ||
                                0}{" "}
                              (
                              {match?.matchScore?.team1Score?.inngs1?.overs ===
                              19.6
                                ? 20
                                : match?.matchScore?.team1Score?.inngs1
                                    ?.overs || 0}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm font-medium mx-4">
                          vs
                        </div>
                        <div className="flex items-center gap-3 flex-1 justify-end text-right">
                          <div>
                            <div className="flex items-center gap-2 justify-end">
                              <span className="font-semibold text-gray-900">
                                {match.matchInfo.team2.teamSName}
                              </span>
                              {match?.matchInfo?.stateTitle?.split(" ")[0] ===
                                match.matchInfo.team2.teamSName && (
                                <span className="text-green-600 text-xs font-medium">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              {match?.matchScore?.team2Score?.inngs1?.runs || 0}
                              /
                              {match?.matchScore?.team2Score?.inngs1?.wickets ||
                                0}{" "}
                              (
                              {match?.matchScore?.team2Score?.inngs1?.overs ===
                              19.6
                                ? 20
                                : match?.matchScore?.team2Score?.inngs1
                                    ?.overs || 0}
                              )
                            </span>
                          </div>
                          <Image
                            faceImageId={match.matchInfo.team2.imageId}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {getReadableDate(match.matchInfo.startDate)}
                        </span>
                        <div className="flex gap-3">
                          <button className="text-blue-600 font-semibold hover:text-blue-700">
                            Schedule
                          </button>
                          <button className="text-blue-600 font-semibold hover:text-blue-700">
                            Points
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 mt-5 w-full">
            <div className="bg-gray-200 flex-1 border w-fit border-slate-300 rounded-xl p-5">
              <h1 className="font-bold text-lg">Deep Stats</h1>
              <p className="text-sm">
                Dive into match insights, head-to-head stats & player analysis.
              </p>
              <img
                src="https://michael-whitehead.com.au/wp-content/uploads/2011/10/Cricket-graph-of-T20-series1.jpg"
                alt=""
                className="mt-2"
              />
            </div>
            <div className="bg-gray-200 flex-1 border w-fit border-slate-300 rounded-xl p-5">
              <h1 className="font-bold text-lg">Historic Moments</h1>
              <p className="text-sm">On This Day in Cricket History.</p>
              <img
                src="https://im.indiatimes.in/content/2023/Oct/Indian-Cricket-History_6530fb1aa44f0.jpg?w=1200&h=900&cc=1&webp=1&q=75"
                alt=""
                className="mt-2"
              />
            </div>
          </div>

          <div className="bg-gray-200 flex-1 my-5 border w-fit border-slate-300 rounded-xl p-5 overflow-hidden">
            <h1 className="font-bold text-lg">Blogs</h1>
            <p className="text-sm">
              Match reviews, player interviews, and expert cricket takes —
              curated for the fans who want more
            </p>
            <div className="relative w-full mt-1 h-60">
              <img
                className="w-full h-full object-cover rounded-xl"
                src={blog?.featuredImage}
                alt=""
              />
              <button
                onClick={() => navigate("/cricket/blogs")}
                className="px-5 py-1 cursor-pointer rounded-full bg-white text-blue-700 absolute bottom-2 right-4"
              >
                Explore Blogs
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-1 bg-gray-200 border rounded-xl border-slate-300 p-5">
              <h1 className="font-bold text-lg">Player Rankings</h1>
              <p className="text-sm">
                Who's ruling the field? Check out the trending players.
              </p>
              <div className="flex mt-5 h-72 overflow-auto flex-col gap-3">
                {playerRankings.length > 0 &&
                  playerRankings.map((e, i) => (
                    <div key={i} className="flex gap-2.5 items-center">
                      <Image
                        className="h-14 w-14 rounded-full"
                        faceImageId={e.faceImageId}
                      />
                      <div>
                        <p className="font-semibold">{e.name}</p>
                        <div className="text-xs flex items-center gap-2">
                          <p>{e.rank} Rank</p>
                          <div className="h-1 w-1 rounded-full bg-sub"></div>
                          <p>{e.points} Points </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => navigate("/cricket/rankings/t20")}
                className="bg-blue-700 cursor-pointer rounded-lg font-semibold text-center mt-2 py-2 text-white w-full"
              >
                Explore Full Rankings
              </button>
            </div>
            <div className="flex-1 bg-gray-200 border rounded-xl border-slate-300 p-5">
              <h2 className="text-xl font-bold mb-1">Fan Predictions</h2>
              <p className="text-gray-700 mb-4">
                Cast your vote — who’s winning today?
              </p>
              {predictions.map((prediction, index) => (
                <div className="relative mb-4" key={index}>
                  <div
                    className={`absolute top-0 left-0 h-full bg-green-200 rounded-xl`}
                    style={{
                      width: `${prediction.percentage}%`,
                      transition: "width 0.3s",
                      zIndex: 1,
                    }}
                  ></div>
                  <div
                    className={`relative bg-white border rounded-xl border-slate-300 py-4 text-center font-semibold cursor-pointer ${
                      selectedPrediction === index ? "bg-gray-300" : ""
                    }`}
                    onClick={() => handlePredictionClick(index)}
                    style={{ zIndex: 2 }} // Ensure the button is above the fill
                  >
                    {prediction.team}{" "}
                    <span className="ml-2 text-sm text-gray-500">
                      {prediction.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-200 flex-1 my-5 border w-fit border-slate-300 rounded-xl p-5 overflow-hidden">
            <InterestingFactsCarousel />
          </div>
        </div>
      </div>

      <div className="bg-gray-200 mx-5 md:mx-24 flex-1 mb-5 border w-fit border-slate-300 rounded-xl p-5 overflow-hidden">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">LATEST NEWS</h1>
          <p
            onClick={() => navigate("/cricket/all-news")}
            className="flex text-sm gap-2 items-center cursor-pointer"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mt-5">
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {news && news.length > 0 ? (
              news.slice(0, 6).map((e, i) =>
                e?.story ? (
                  <div
                    key={i}
                    onClick={() => navigate(`/cricket/news/${e.story.id}`)}
                    className="cursor-pointer"
                  >
                    <Image
                      faceImageId={e.story.imageId}
                      className="w-full rounded-lg"
                      resolution="de"
                    />
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {e.story.coverImage?.source || "Unknown"} &bull;{" "}
                        {new Date(
                          Number(e.story.pubTime || Date.now())
                        ).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="font-bold text-lg line-clamp-2 mt-1">
                        {e.story.hline}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2 mt-1">
                        {e.story.intro}
                      </p>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <p className="text-gray-500 italic">No news available</p>
            )}
          </div>

          <div
            className="w-full lg:w-1/3 relative cursor-pointer"
            onClick={() =>
              news?.[6]?.story && navigate(`/cricket/news/${news[6].story.id}`)
            }
          >
            {news?.[6]?.story ? (
              <>
                <Image
                  faceImageId={news[6].story.imageId}
                  className="w-full h-full object-cover rounded-lg"
                  resolution="de"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
                  <p className="text-sm text-white mb-1">
                    {news[6].story.coverImage?.source || "Unknown"} &bull;{" "}
                    {new Date(
                      Number(news[6].story.pubTime || Date.now())
                    ).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xl font-bold text-white">
                    {news[6].story.hline}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">
                Featured news not available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 md:mx-24">
        <Gallery id={1} />
      </div>
    </div>
  );
}
