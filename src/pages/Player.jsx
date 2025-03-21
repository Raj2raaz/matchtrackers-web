import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaCircle } from "react-icons/fa";
import { getPlayerInfo } from "../api/Home";
import { useNavigate, useParams } from "react-router-dom";
import Image from "../components/Image";
import data from "../data.json";
import useCricbuzzStore from "../store/mainStore";

const Player = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [info, setInfo] = useState({});
  const { trendingPlayers } = useCricbuzzStore();

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
  const [expandeBio, setExpandedBio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const data = await getPlayerInfo(id);
    setInfo(data);
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="px-4 flex gap-4 pt-6">
        <div className="w-1/3  h-full">
          <Image
            faceImageId={info?.info?.faceImageId}
            className="h-full w-full"
            key={id}
            resolution="thumb"
          />
          {/* <img
            src={data?.IndianPlayers[0].imageLink}
            className="h-full w-full"
            alt=""
          /> */}

          <div className="border border-gray-300 bg-white rounded shadow mt-4 p-4">
            <div className="flex items-center pb-3 gap-3 text font-medium">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                alt=""
                className="h-5 "
              />
              Most Viewed Players
            </div>
            <div>
              {data?.IndianPlayers.slice(0, 10).map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/player/" + e.profileId)}
                  className="flex cursor-pointer gap-3 items-center my-3"
                >
                  <img
                    src={e.imageLink}
                    className="h-8 w-8 rounded-full"
                    alt=""
                  />
                  <p className="font-medium">{e.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-gray-300 bg-white rounded shadow mt-4 p-4">
            <div className="flex items-center pb-3 gap-3 text font-medium">
              Most Trending Players
            </div>
            <div>
              {trendingPlayers?.player?.map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/player/" + e.id)}
                  className="flex cursor-pointer gap-3 items-center my-3"
                >
                  <Image
                    faceImageId={e.faceImageId}
                    className="h-7 w-7 rounded-full"
                  />
                  <p className="font-medium">{e.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="md:w-full">
            <div className="bg-white rounded shadow mb-6">
              {/* Player Info */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-semibold">{info?.info?.name}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">BORN</p>
                    <p className="text-sm font-semibold">
                      {info?.info?.DoBFormat}, {info?.info?.birthPlace}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">AGE</p>
                    <p className="text-sm font-semibold">
                      ({info?.info?.DoB?.split("(")[1]}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">BATTING STYLE</p>
                    <p className="text-sm font-semibold">{info?.info?.bat}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">BOWLING STYLE</p>
                    <p className="text-sm font-semibold">{info?.info?.bowl}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">PLAYING ROLE</p>
                    <p className="text-sm font-semibold">{info?.info?.role}</p>
                  </div>
                </div>

                {/* Teams */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">TEAMS</p>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                    {info?.info?.teamNameIds?.map((team, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm font-medium bg-gray-100 rounded px-2 py-1"
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
                    className={`text-sm text-gray-700 mb-3 transition-all ${
                      expandeBio ? "" : "line-clamp-4 overflow-hidden"
                    }`}
                    dangerouslySetInnerHTML={{ __html: info?.info?.bio }}
                  ></p>
                  {!expandeBio && (
                    <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>
                <button
                  className="text-blue-600 mx-auto w-full cursor-pointer text-sm font-medium"
                  onClick={() => setExpandedBio(!expandeBio)}
                >
                  {expandeBio ? "View less" : "View more"}
                </button>
              </div>
            </div>

            {/* Career Stats */}
            <div className="bg-white rounded shadow my-6">
              <div className="px-4 py-2 border-gray-300 border-b">
                <h2 className="text-lg font-bold">
                  {info?.info?.name} Career Stats
                </h2>
              </div>
              <div className="overflow-x-auto">
                <p className="mx-4 font-medium text-sm py-1">BATTING CAREER</p>
                <table className="min-w-full border border-gray-200">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-xs text-gray-600 text-left ">
                        Format
                      </th>
                      {info?.batting?.values?.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-3 py-2 text-xs text-gray-600 text-left "
                        >
                          {cricketStatShortforms(header.values[0])}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {info?.batting?.headers
                      ?.slice(1)
                      ?.map((format, formatIdx) => (
                        <tr
                          key={formatIdx}
                          className={
                            formatIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          {/* Format Name Column */}
                          <td className="px-3 py-2 text-xs font-bold text-left ">
                            {format}
                          </td>

                          {/* Player Stats */}
                          {info?.batting?.values?.map((row, rowIdx) => (
                            <td key={rowIdx} className="px-3 py-2 text-xs ">
                              {row.values[formatIdx + 1]}{" "}
                              {/* +1 to skip "Matches" row header */}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto mt-5">
                <p className="mx-4 font-medium text-sm py-1">BOWLING CAREER</p>
                <table className="min-w-full border border-gray-200">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-xs text-gray-600 text-left ">
                        Format
                      </th>
                      {info?.bowling?.values?.map((header, idx) => (
                        <th
                          key={idx}
                          className="px-3 py-2 text-xs text-gray-600 text-left "
                        >
                          {cricketStatShortforms(header.values[0])}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {info?.bowling?.headers
                      ?.slice(1)
                      ?.map((format, formatIdx) => (
                        <tr
                          key={formatIdx}
                          className={
                            formatIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          {/* Format Name Column */}
                          <td className="px-3 py-2 text-xs font-bold text-left ">
                            {format}
                          </td>

                          {/* Player Stats */}
                          {info?.bowling?.values?.map((row, rowIdx) => (
                            <td key={rowIdx} className="px-3 py-2 text-xs ">
                              {row.values[formatIdx + 1]}{" "}
                              {/* +1 to skip "Matches" row header */}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Rankings  */}
          <div className="p-4 bg-white mb-5 shadow-md rounded">
            <h2 className="text-lg font-bold mb-3">
              {info?.info?.name} Rankings
            </h2>
            <div className="space-y-3 ">
              {info?.info?.rankings &&
                Object.entries(info.info.rankings).map(([category, ranks]) => (
                  <div key={category}>
                    <h3 className="text-md underline font-semibold capitalize mb-2">
                      {category === "bat"
                        ? "Batting"
                        : category === "bowl"
                        ? "Bowling"
                        : "All-rounder"}
                    </h3>

                    <ul className="grid grid-cols-5 gap-2">
                      {ranks &&
                        Object.entries(ranks).map(([key, value]) => (
                          <li key={key} className="text-sm text-gray-700">
                            <span className="font-medium">
                              {formatRankTitle(key)}:
                            </span>{" "}
                            {value}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          {/* Debut/Last Matches */}
          <div className="bg-white rounded shadow mb-6">
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-lg font-bold">
                Debut/Last Matches of {info?.info?.name}
              </h2>
            </div>
            {info?.career?.values?.map((category, index) => (
              <div
                key={index}
                className="border-b border-gray-300 last:border-b-0"
              >
                <div className="p-3 bg-gray-50 text-lg capitalize font-semibold ">
                  {category.name}
                </div>
                <table className="min-w-full border border-gray-200">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 text-gray-500">Debut</td>
                      <td className="px-4 py-2 font-medium">
                        {category?.debut || "N/A"}
                      </td>
                    </tr>
                    <tr className="">
                      <td className="px-4 py-2 w-[14rem] text-gray-500">
                        Last Played
                      </td>
                      <td className="px-4  py-2 font-medium">
                        {category?.lastPlayed || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* news  */}
      {info?.info?.news && (
        <div className="border shadow bg-white border-gray-200 p-5">
          <h1 className="text-xl mb-3 font-semibold">
            Top News - {info?.info?.name}
          </h1>
          <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 no-scrollbar">
            {info?.news?.slice(0, 6).map((e, i) => (
              <div
                key={i}
                className="bg-black flex-shrink-0 w-[calc(100%/4.5)] text-white rounded-2xl snap-start"
              >
                <Image
                  faceImageId={e?.story?.imageId}
                  resolution="gthumb"
                  className="w-full h-[15rem] rounded-2xl"
                />
                <div className="p-4">
                  <h1 className="text-lg font-semibold">{e?.story?.hline}</h1>
                  <p className="line-clamp-3 text-sm">{e?.story?.intro}</p>
                  <p className="text-gray-200">
                    Source: {e?.story.coverImage?.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
