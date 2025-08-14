import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaCircle } from "react-icons/fa";
import { getPlayerInfo } from "../api/Home";
import { useNavigate, useParams } from "react-router-dom";
import Image from "../components/Image";
import data from "../data.json";
import useCricbuzzStore from "../store/cricket";
import TrendingPlayers from "../components/TrendingPlayers";
import useMainStore from "../store/MainStore";
import YtShorts from "../components/YtShorts";
import { Helmet } from "react-helmet-async";

const Player = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);
  const { trendingPlayers } = useCricbuzzStore();
  const [expandeBio, setExpandedBio] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { content } = useMainStore();

  const tabs = [
    { id: "overview", label: "OVERVIEW" },
    { id: "stats", label: "STATS" },
    { id: "records", label: "RECORDS" },
    { id: "videos", label: "VIDEOS" },
    { id: "articles", label: "ARTICLES" },
    { id: "photos", label: "PHOTOS" },
    { id: "timeline", label: "TIMELINE" },
  ];

  const cricketStatShortforms = (label) => {
    const mapping = {
      Format: "Fmt",
      Matches: "Mat",
      Innings: "Inns",
      Runs: "R",
      Balls: "B",
      Highest: "HS",
      Average: "Avg",
      SR: "SR", // Already short
      "Not Out": "NO",
      Fours: "4s",
      Sixes: "6s",
      Ducks: "D",
      "50s": "50s", // Already short
      "100s": "100s", // Already short
      "200s": "200s", // Already short
      "300s": "300s", // Already short
      "400s": "400s", // Already short
    };

    return mapping[label] || label; // Default to original if not found
  };

  const formatRankTitle = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^t /i, "T20 ") // Fix "t " to "T20"
      .replace(/^odi/i, "ODI ")
      .replace(/^test/i, "Test ")
      .trim();
  };

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    // Handle responsive layout
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [id, content]);

  const fetchData = async () => {
    try {
      const data = await getPlayerInfo(id);
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No player data found");
      }
      setInfo(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching player data:", err);
      setError(err.message || "Unable to fetch player information");
      setInfo({});
    }
  };

  // Error rendering component
  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto mb-4 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Player Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          {error || "The requested player information could not be retrieved."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  // If there's an error, render the error component
  if (error) {
    return <ErrorDisplay />;
  }

  return (
  <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
    {/* Tabs section - only visible on mobile */}
    {isMobile && (
      <div className="bg-white dark:bg-gray-800 py-2 px-2 sticky top-0 z-10 shadow-md">
        <div className="overflow-x-auto whitespace-nowrap no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium mx-1 ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    )}

    {info?.info && (
      <Helmet>
        <title>Player Info | {info?.info?.name}</title>
        <meta name="description" content="Player Info with Latest Stats" />
        <meta property="og:title" content="Player Info | Match Trackers" />
        <meta
          property="og:description"
          content="Player Info with Latest Stats"
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
    )}

    <div className="px-4 flex flex-col md:flex-row gap-4 pt-6">
      {/* Left column - changes to top on mobile */}
      <div className={`md:w-1/3 w-full ${isMobile ? "order-1" : ""}`}>
        <div className="md:flex items-center hidden gap-4">
          <Image
            faceImageId={info?.info?.faceImageId}
            className="h-32 w-32 md:h-full md:w-full rounded-full md:rounded-none"
            key={id}
            resolution="thumb"
          />
          {isMobile && (
            <div>
              <h1 className="text-xl font-bold">{info?.info?.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {info?.info?.role}
              </p>
            </div>
          )}
        </div>

        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow mt-4 p-4">
          <div className="flex items-center pb-3 gap-3 text font-medium">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              alt=""
              className="h-5"
            />
            Most Viewed Players
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {data?.IndianPlayers?.slice(0, isMobile ? 6 : 10).map((e, i) => (
              <div
                key={i}
                onClick={() => navigate("/cricket/player/" + e.profileId)}
                className="flex cursor-pointer gap-3 items-center my-2 md:my-3"
              >
                <img
                  src={e.imageLink}
                  className="h-8 w-8 rounded-full"
                  alt=""
                />
                <p className="font-medium text-sm md:text-base">{e.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow mt-4 p-4">
          <div className="flex items-center pb-3 gap-3 text font-medium">
            Most Trending Players
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {trendingPlayers?.player
              ?.slice(0, isMobile ? 6 : undefined)
              .map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/cricket/player/" + e.id)}
                  className="flex cursor-pointer gap-3 items-center my-2 md:my-3"
                >
                  <Image
                    faceImageId={e.faceImageId}
                    className="h-7 w-7 rounded-full"
                  />
                  <p className="font-medium text-sm md:text-base">{e.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Right column / main content */}
      <div className="w-full">
        <div className="flex mb-4 items-center md:hidden gap-4">
          <Image
            faceImageId={info?.info?.faceImageId}
            className="h-32 w-32 md:h-full md:w-full rounded-full md:rounded-none"
            key={id}
            resolution="thumb"
          />
          {isMobile && (
            <div>
              <h1 className="text-xl font-bold">{info?.info?.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {info?.info?.role}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded shadow mb-6">
          {!isMobile && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold">{info?.info?.name}</h2>
            </div>
          )}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="text-sm font-semibold">{info?.info?.name}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">BORN</p>
                <p className="text-sm font-semibold">
                  {info?.info?.DoBFormat}, {info?.info?.birthPlace}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">AGE</p>
                <p className="text-sm font-semibold">
                  {info?.info?.DoB?.split("(")[1]
                    ? `(${info?.info?.DoB?.split("(")[1]}`
                    : "-"}
                </p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  BATTING STYLE
                </p>
                <p className="text-sm font-semibold">{info?.info?.bat || "-"}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  BOWLING STYLE
                </p>
                <p className="text-sm font-semibold">{info?.info?.bowl || "-"}</p>
              </div>
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PLAYING ROLE
                </p>
                <p className="text-sm font-semibold">{info?.info?.role || "-"}</p>
              </div>
            </div>

            {/* Teams */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">TEAMS</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 md:gap-x-4 gap-y-2">
                {info?.info?.teamNameIds?.map((team, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs md:text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                  >
                    <span className="mr-1">{team.teamName}</span>
                    <span className="text-xs">{team.country}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">
              {info?.info?.name} - Player Profile
            </h2>
            <div className="relative">
              <p
                className={`text-sm text-gray-700 dark:text-gray-300 mb-3 transition-all ${
                  expandeBio ? "" : "line-clamp-4 overflow-hidden"
                }`}
                dangerouslySetInnerHTML={{ __html: info?.info?.bio }}
              ></p>
              {!expandeBio && (
                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
              )}
            </div>
            <button
              className="text-blue-600 dark:text-blue-400 mx-auto w-full cursor-pointer text-sm font-medium"
              onClick={() => setExpandedBio(!expandeBio)}
            >
              {expandeBio ? "View less" : "View more"}
            </button>
          </div>
        </div>

        {/* Career Stats */}
        <div className="bg-white dark:bg-gray-800 rounded shadow my-6">
          <div className="px-4 py-2 border-gray-300 dark:border-gray-700 border-b">
            <h2 className="text-lg font-bold">{info?.info?.name} Career Stats</h2>
          </div>
          <div className="overflow-x-auto">
            <p className="mx-4 font-medium text-sm py-1">BATTING CAREER</p>
            <div className="min-w-max">
              <table className="w-full border border-gray-200 dark:border-gray-700">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 text-left ">
                      Format
                    </th>
                    {info?.batting?.values?.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 text-left "
                      >
                        {cricketStatShortforms(header.values[0])}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {info?.batting?.headers?.slice(1)?.map((format, formatIdx) => (
                    <tr
                      key={formatIdx}
                      className={formatIdx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                    >
                      <td className="px-3 py-2 text-xs font-bold text-left ">{format}</td>
                      {info?.batting?.values?.map((row, rowIdx) => (
                        <td key={rowIdx} className="px-3 py-2 text-xs ">{row.values[formatIdx + 1]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-x-auto mt-5">
            <p className="mx-4 font-medium text-sm py-1">BOWLING CAREER</p>
            <div className="min-w-max">
              <table className="w-full border border-gray-200 dark:border-gray-700">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 text-left ">
                      Format
                    </th>
                    {info?.bowling?.values?.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 text-left "
                      >
                        {cricketStatShortforms(header.values[0])}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {info?.bowling?.headers?.slice(1)?.map((format, formatIdx) => (
                    <tr
                      key={formatIdx}
                      className={formatIdx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}
                    >
                      <td className="px-3 py-2 text-xs font-bold text-left ">{format}</td>
                      {info?.bowling?.values?.map((row, rowIdx) => (
                        <td key={rowIdx} className="px-3 py-2 text-xs ">{row.values[formatIdx + 1]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* News Section */}
    {info?.info?.news && (
      <div className="border shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4 md:p-5">
        <h1 className="text-xl mb-3 font-semibold">
          Top News - {info?.info?.name}
        </h1>
        <div className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 no-scrollbar">
          {info?.news?.slice(0, 6).map((e, i) => (
            <div
              key={i}
              className="bg-black dark:bg-gray-900 flex-shrink-0 w-[85%] sm:w-[45%] md:w-[calc(100%/3)] lg:w-[calc(100%/4.5)] text-white rounded-2xl snap-start"
            >
              <Image
                faceImageId={e?.story?.imageId}
                resolution="gthumb"
                className="w-full h-40 md:h-[15rem] rounded-t-2xl"
              />
              <div className="p-3 md:p-4">
                <h1 className="text-base md:text-lg font-semibold">
                  {e?.story?.hline}
                </h1>
                <p className="line-clamp-2 md:line-clamp-3 text-xs md:text-sm">
                  {e?.story?.intro}
                </p>
                <p className="text-gray-200 dark:text-gray-400 text-xs">
                  Source: {e?.story.coverImage?.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <YtShorts />
  </div>
);

};

export default Player;
