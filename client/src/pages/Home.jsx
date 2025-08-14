import React, { useEffect, useState } from "react";
import HomeSkeleton from "../components/HomeSkeleton";
import header from "../assets/Landing/header.webp";
import headermv from "../assets/Landing/headermv.webp";
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
import { CgChevronDoubleDown, CgChevronDoubleUp } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import englandtour from "../assets/headerMatches/englandtour.webp";
import { FaChevronRight, FaTrophy, FaFire, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import YtShorts from "../components/YtShorts";
import HistoricMoments from "../components/HistoricMoments";
import FanPredictions from "../components/FanPredictions";
import BlogSection from "../components/HomePage/BlogSection";
import NewsSection from "../components/HomePage/NewsSection";
import PlayerRankings from "../components/HomePage/PlayerRankings";
import UpcomingFixtures from "../components/HomePage/UpcomingFixtures";

const getColorClass = (index) => {
    const colors = [
      "red-500", "blue-500", "green-500", "yellow-500",
      "purple-500", "pink-500", "orange-500", "teal-500",
    ];
    return colors[index % colors.length];
  };

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

  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initial data loading
  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
  }, []);

  // Load data when category changes (but don't show skeleton for category changes)
  useEffect(() => {
    if (!isLoading) {
      loadData();
    }
  }, [selectedCat]);

  // Intersection Observer for animations
  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({
                ...prev,
                [entry.target.id]: true,
              }));
            }
          });
        },
        { threshold: 0.1, rootMargin: "50px" }
      );

      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((el, index) => {
        if (!el.id) el.id = `animate-${index}`;
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [isLoading]);

  const initialPredictions = [
    { team: "India", percentage: 45 },
    { team: "Australia", percentage: 30 },
    { team: "England", percentage: 25 },
  ];
  const [predictions, setPredictions] = useState(initialPredictions);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  useEffect(() => {
    // Check memory for existing vote (removed localStorage)
    const votedIndex = null; // Remove localStorage dependency

    if (votedIndex !== null) {
      setSelectedPrediction(Number(votedIndex));
      const updatedPredictions = [...predictions];
      updatedPredictions[Number(votedIndex)].percentage += 3;
      setPredictions(updatedPredictions);
    }
  }, []);

  const handlePredictionClick = (index) => {
    const newPredictions = [...predictions];

    if (selectedPrediction !== null) {
      const previousIndex = selectedPrediction;
      const decreaseAmount =
        (newPredictions[previousIndex].percentage / 100) * 3;
      newPredictions[previousIndex].percentage -= decreaseAmount;
    }

    const increaseAmount = 3;
    newPredictions[index].percentage += increaseAmount;

    const totalPercentage = newPredictions.reduce(
      (acc, curr) => acc + curr.percentage,
      0
    );

    newPredictions.forEach((prediction, i) => {
      if (i !== index) {
        const decreaseAmount =
          (totalPercentage - 100) / (newPredictions.length - 1);
        prediction.percentage = parseFloat(
          (prediction.percentage - decreaseAmount).toFixed(1)
        );
      }
    });

    setPredictions(newPredictions);
    setSelectedPrediction(index);
  };

  const loadData = async () => {
    try {
      const rcMatches = await getMatches(
        selectedCat === 1 ? "live" : selectedCat === 2 ? "upcoming" : "recent"
      );
      setTopSectionMatches(rcMatches);
      const series = await getAllSeriesList();
      setSeriesList(series);

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

  // Show skeleton while loading
  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex flex-col overflow-hidden">
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

      {/* Hero Section with Enhanced Animation */}
      <div className="relative overflow-hidden">
        {/* Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 z-10"></div>

        {/* Desktop Hero Image */}
        <img
          src={header}
          alt="Hero"
          className="hidden md:block w-full h-auto transform transition-transform duration-700 hover:scale-105 animate-float"
        />

        {/* Mobile Hero Image */}
        <img
          src={headermv}
          alt="Hero Mobile"
          className="block md:hidden w-full h-auto transform transition-transform duration-700 hover:scale-105 animate-float"
        />

        {/*
        <div className="absolute bottom-0 h-[60%] bg-gradient-to-t from-[#002B5B] via-[#002B5B]/80 to-transparent w-full z-20">
          <div className="md:flex flex-col hidden w-full gap-4 justify-end text-white py-8 h-full items-center">
            
            <div
              className="animate-fadeInUp opacity-0"
              style={{
                animationDelay: "0.3s",
                animationFillMode: "forwards",
              }}
            >
              <p className="text-center text-lg font-medium max-w-2xl leading-relaxed">
                Experience the thrill of cricket like never before with
                <span className="gradient-text font-bold"> live scores</span>,
                expert insights and match predictions, all in real time.
              </p>
            </div>

            
            <div
              className="md:flex hidden gap-4 flex-wrap justify-center animate-fadeInUp opacity-0"
              style={{
                animationDelay: "0.6s",
                animationFillMode: "forwards",
              }}
            >
              {[
                {
                  name: "News",
                  icon: "📰",
                },
                {
                  name: "Analytics",
                  icon: "📊",
                },
                {
                  name: "Highlights",
                  icon: "🎥",
                },
                {
                  name: "Matches",
                  icon: "🏏",
                },
              ].map((item, i) => (
                <button
                  className="font-semibold border-2 border-white/30 px-6 py-2 rounded-full backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 group"
                  key={i}
                >
                  <span className="mr-2 group-hover:animate-bounce inline-block">
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              ))}
            </div>

            
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-4 px-8 py-3 font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg animate-pulseGlow opacity-0 animate-fadeInUp"
              style={{
                animationDelay: "0.9s",
                animationFillMode: "forwards",
              }}
            >
              Join the Action
            </button>
          </div>
        </div> 
        */}

      </div>

      {/* Enhanced Match Categories Section */}
<div className="bg-gradient-to-br from-[#002b5b] via-[#1e40af] to-[#002b5b] py-10 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
  
  {/* Animated background */}
  <div className="absolute inset-0 bg-[#002B5B] opacity-10 z-0"></div>

  {/* Category Buttons */}
<div
  className="flex flex-nowrap overflow-x-auto gap-2 mb-6 sm:mb-8 scrollbar-hide"
  data-animate
>
  {["Featured", "Live Score", "Upcoming", "Result"].map((category, i) => (
    <button
      key={i}
      className={`flex-shrink-0 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
        selectedCat === i
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-pulse-glow"
          : "bg-white/10 dark:bg-black/20 text-white hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20"
      }`}
      onClick={() => setSelectedCat(i)}
    >
      <span className="mr-1 sm:mr-2">
        {i === 0 ? "⭐" : i === 1 ? "🔴" : i === 2 ? "⏰" : "🏆"}
      </span>
      {category}
    </button>
  ))}
</div>

  {/* Match cards scroll container */}
  <div className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide mx-2 sm:mx-0 pb-4">
    {topSectionMatches?.length > 0 &&
      topSectionMatches.map((match, i) => (
        <div
          key={i}
          className="flex-shrink-0 min-w-[90%] sm:min-w-[340px] max-w-sm mx-2 sm:mx-0"
          data-animate
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          {/* Match Card */}
          <div
            onClick={() => navigate("/cricket/match/" + match.matchInfo.matchId)}
            className="match-card bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm relative cursor-pointer shadow-xl mt-4 rounded-2xl border border-white/20 dark:border-gray-700 p-4 sm:p-6 hover:shadow-2xl group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 dark:from-gray-700 to-purple-50 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

            {/* Top info section */}
            <div className="flex flex-col sm:flex-row text-sm items-start sm:items-center justify-between gap-2 sm:gap-0 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="font-semibold text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {match.matchInfo.matchDesc}
                  </p>
                  <p className="font-semibold text-xs text-gray-600 dark:text-gray-300 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                    {match.matchInfo.matchFormat}
                  </p>
                </div>
                <p className="text-xs truncate max-w-[220px] text-gray-500 dark:text-gray-400 font-medium">
                  📍 {match?.matchInfo?.venueInfo?.ground}
                </p>
              </div>

              <div
                className={`px-2 py-2 text-xs flex items-center font-semibold rounded-full transition-all duration-300 ${
                  match.matchInfo.state === "In Progress"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-lg"
                    : match.matchInfo.state === "Complete"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-r from-gray-300 dark:from-gray-600 to-gray-400 dark:to-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                <span className="mr-1 sm:mr-2">
                  {match.matchInfo.state === "In Progress"
                    ? "🔴"
                    : match.matchInfo.state === "Complete"
                    ? "✅"
                    : "⏳"}
                </span>
                {match.matchInfo.state}
              </div>
            </div>

            {/* Team Comparison Section */}
            <div className="flex justify-between items-center mt-6 gap-3 sm:gap-6 relative z-10">
              {/* Team 1 */}
              <div className="flex flex-col flex-1 items-start space-y-2 relative">
                <div className="flex items-center font-bold text-lg gap-2 group/team hover:scale-105 transition-transform duration-200">
                  <Image
                    faceImageId={match.matchInfo.team1.imageId}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-blue-100 group-hover/team:ring-blue-300 transition-all duration-200"
                  />
                  <span className="group-hover/team:text-blue-600 dark:group-hover/team:text-blue-400 transition-colors duration-200 dark:text-gray-100">
                    {match.matchInfo.team1.teamSName}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 dark:from-gray-700 to-purple-50 dark:to-gray-700 px-2 py-1 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {match?.matchScore?.team1Score?.inngs1?.runs || 0}/
                    {match?.matchScore?.team1Score?.inngs1?.wickets || 0} (
                    {match?.matchScore?.team1Score?.inngs1?.overs === 19.6
                      ? 20
                      : match?.matchScore?.team1Score?.inngs1?.overs || 0}
                    )
                  </p>
                </div>
              </div>

              {/* VS Text + Date */}
              <div className="text-center space-y-2">
                <p className="font-bold text-xl sm:text-2xl text-gray-400 dark:text-gray-500 animate-pulse">
                  vs
                </p>
                <div className="bg-gradient-to-r from-gray-100 dark:from-gray-700 to-gray-200 dark:to-gray-800 rounded-full px-3 py-1 shadow-inner">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {getReadableDate(match.matchInfo.startDate)}
                  </p>
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex flex-col flex-1 items-end space-y-2 relative">
                <div className="flex items-center font-bold text-lg gap-2 group/team hover:scale-105 transition-transform duration-200">
                  <span className="group-hover/team:text-purple-600 dark:group-hover/team:text-purple-400 transition-colors duration-200 dark:text-gray-100">
                    {match.matchInfo.team2.teamSName}
                  </span>
                  <Image
                    faceImageId={match.matchInfo.team2.imageId}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-2 ring-purple-100 group-hover/team:ring-purple-300 transition-all duration-200"
                  />
                </div>
                <div className="bg-gradient-to-r from-purple-50 dark:from-gray-700 to-blue-50 dark:to-gray-700 px-2 py-1 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {match?.matchScore?.team2Score?.inngs1?.runs || 0}/
                    {match?.matchScore?.team2Score?.inngs1?.wickets || 0} (
                    {match?.matchScore?.team2Score?.inngs1?.overs === 19.6
                      ? 20
                      : match?.matchScore?.team2Score?.inngs1?.overs || 0}
                    )
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-2xl -mt-3 p-4 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 shimmer-effect opacity-20"></div>
            <div className="flex justify-between font-semibold text-sm text-white items-center relative z-10">
              <button
                onClick={() =>
                  navigate("/cricket/schedules/" + match.matchInfo.seriesId)
                }
                className="cursor-pointer hover:text-yellow-300 transition-colors duration-200 flex items-center gap-1 group"
              >
                <span className="group-hover:rotate-12 transition-transform duration-200">
                  📅
                </span>
                Schedule
              </button>
              <button
                onClick={() =>
                  navigate("/cricket/points-table/" + match.matchInfo.seriesId)
                }
                className="cursor-pointer hover:text-yellow-300 transition-colors duration-200 flex items-center gap-1 group"
              >
                <span className="group-hover:rotate-12 transition-transform duration-200">
                  📊
                </span>
                Point Table
              </button>
            </div>
          </div>
        </div>
      ))}
  </div>
</div>


      {/* Enhanced Main Content Section */}
<div className="flex flex-col md:flex-row gap-8 my-8 px-5 md:px-24">
  {/* Recent Highlights Section */}
  <div className="w-full md:w-1/3 flex flex-col">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
      Recent Highlights
    </h2>

    <div
      className="overflow-y-auto space-y-4 pr-1 scrollbar-hide"
      style={{ maxHeight: "28rem" }}
    >
      {seriesList && seriesList.length > 0 ? (
        seriesList.slice(0, seriesShown).map((e, i) => (
          <div
            onClick={() => navigate("/cricket/schedules/" + e.id)}
            key={i}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer w-full px-4 py-3 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 transition duration-200"
          >
            <p className="text-base text-gray-800 dark:text-gray-100 font-semibold leading-snug break-words">
              {e.name}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic text-lg">
          No recent matches available
        </p>
      )}
    </div>
  </div>

  {/* England Tour Section */}
  <div className="w-full md:w-2/3" data-animate>
    <div className="relative w-full overflow-hidden rounded-2xl group shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
      <img
        src={englandtour}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt="England Tour"
      />
      <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
        <h3 className="text-2xl font-bold mb-2">
          England Tour Highlights
        </h3>
        <p className="text-sm opacity-90">
          Catch the most exciting moments from the series
        </p>
      </div>
    </div>

    <div className="flex md:flex-row flex-col gap-3 mt-4 font-semibold w-full">
      <button
        onClick={() => navigate("/cricket/schedules/8786")}
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex-1 py-3 text-white cursor-pointer rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
      >
        🎥 View Full Highlights
      </button>
      <button
        onClick={() => navigate("/cricket/schedules/8786")}
        className="text-blue-700 dark:text-blue-400 flex-1 py-3 border-2 border-blue-700 dark:border-blue-400 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
      >
        View Match Summary
      </button>
    </div>
  </div>
</div>

      {/* components */}
      <div className="flex flex-col md:flex-row gap-5 py-3 px-5 md:px-24">
        <div className="flex-1">
          <UpcomingFixtures upcomingMatches={upcomingMatches} />

          <HistoricMoments />

          <BlogSection blog={blog} />
        </div>

        <div className="flex-1 flex flex-col mb-5">
          <div className="flex flex-col md:flex-row gap-5">
            <PlayerRankings />
            <FanPredictions
              predictions={predictions}
              handlePredictionClick={handlePredictionClick}
              selectedPrediction={selectedPrediction}
            />
          </div>
          <div className="mt-5 flex-1">
            <YtShorts />
          </div>
        </div>
      </div>

      {/* <Gallery /> */}
<div className="mx-5 md:mx-24 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
  <Gallery id={1} />
</div>

    </div>
  );
}