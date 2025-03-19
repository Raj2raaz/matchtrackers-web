import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { getRecentMatches } from "../api/Home";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { CgChevronDoubleDown } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import team from "../assets/team.png";
import headingPost from "../assets/headingPost.png";
import headingPost2 from "../assets/headingPost2.png";
import featuredVid1 from "../assets/featuredVid1.png";
import featuredVid2 from "../assets/featuredVid2.png";
import blogs1 from "../assets/blogs1.png";
import blogs2 from "../assets/blogs2.png";
import blogs3 from "../assets/blogs3.png";
import blogs4 from "../assets/blogs4.png";

const sports = [
  "Men's Cycling",
  "Wrestling",
  "Cricket",
  "Football",
  "Basketball",
];

const higlighted = [
  "India vs Pak ODI series || Match 23",
  "Football league || Alnasar vs xyz team",
  "India vs Pak ODI series || Match 23",
  "Football league || Alnasar vs xyz team",
  "India vs Pak ODI series || Match 23",
  "Football league || Alnasar vs xyz team",
  "India vs Pak ODI series || Match 23",
  "Football league || Alnasar vs xyz team",
  "India vs Pak ODI series || Match 23",
  "Football league || Alnasar vs xyz team",
];

const matches = [
  {
    matchId: "01",
    stadium: "Chinnaswami Stadium",
    status: "Live",
    teams: [
      {
        name: "India",
        shortName: "Ind",
        countryCode: "IN",
        score: "39/5",
        overs: "17.4",
      },
      {
        name: "Pakistan",
        shortName: "Pak",
        countryCode: "PK",
        score: "179/6",
        overs: "20",
      },
    ],
    liveUpdatesLink: "/live-updates",
  },
  {
    matchId: "01",
    stadium: "Chinnaswami Stadium",
    status: "Live",
    teams: [
      {
        name: "India",
        shortName: "Ind",
        countryCode: "IN",
        score: "39/5",
        overs: "17.4",
      },
      {
        name: "Pakistan",
        shortName: "Pak",
        countryCode: "PK",
        score: "179/6",
        overs: "20",
      },
    ],
    liveUpdatesLink: "/live-updates",
  },
  {
    matchId: "01",
    stadium: "Chinnaswami Stadium",
    status: "Finished",
    teams: [
      {
        name: "India",
        shortName: "Ind",
        countryCode: "IN",
        score: "39/5",
        overs: "17.4",
      },
      {
        name: "Pakistan",
        shortName: "Pak",
        countryCode: "PK",
        score: "179/6",
        overs: "20",
      },
    ],
    liveUpdatesLink: "/live-updates",
  },
  {
    matchId: "01",
    stadium: "Chinnaswami Stadium",
    status: "Finished",
    teams: [
      {
        name: "India",
        shortName: "Ind",
        countryCode: "IN",
        score: "39/5",
        overs: "17.4",
      },
      {
        name: "Pakistan",
        shortName: "Pak",
        countryCode: "PK",
        score: "179/6",
        overs: "20",
      },
    ],
    liveUpdatesLink: "/live-updates",
  },
  {
    matchId: "01",
    stadium: "Chinnaswami Stadium",
    status: "Upcoming",
    teams: [
      {
        name: "India",
        shortName: "Ind",
        countryCode: "IN",
        score: "39/5",
        overs: "17.4",
      },
      {
        name: "Pakistan",
        shortName: "Pak",
        countryCode: "PK",
        score: "179/6",
        overs: "20",
      },
    ],
    liveUpdatesLink: "/live-updates",
  },
];

const featuredVids = [
  featuredVid1,
  featuredVid2,
  featuredVid1,
  featuredVid2,
  featuredVid1,
  featuredVid2,
];

const blogs = [
  {
    img: blogs1,
    title: "Blues must treat qualifiers like playoffs, allen says",
    by: "Mike Fink",
    time: "Mar 28, 2020",
  },
  {
    img: blogs2,
    title: "Blues must treat qualifiers like playoffs, allen says",
    by: "Mike Fink",
    time: "Mar 28, 2020",
  },
  {
    img: blogs3,
    title: "Blues must treat qualifiers like playoffs, allen says",
    by: "Mike Fink",
    time: "Mar 28, 2020",
  },
];

export default function Home() {
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
              Highligted matches today
            </h1>
            <div className="text-sm mt-4 text-primary">
              {higlighted.slice(5).map((e, i) => (
                <div
                  key={i}
                  className=" bg-gray-200 items-center flex justify-between mt-2 pl-3 pr-1.5 py-1.5 rounded-full"
                >
                  <p>{e}</p>
                  <IoMdArrowDroprightCircle size={26} />
                </div>
              ))}
            </div>
            <button className="flex cursor-pointer mx-auto mt-2 text-sm font-medium items-end">
              See more <CgChevronDoubleDown size={15} />
            </button>
          </div>

          <div className="mt-5">
            {matches.map((e, i) => (
              <div
                key={i}
                className=" bg-white shadow-lg mt-4 rounded-lg border border-[#E6E6E6] p-5"
              >
                <div className="flex text-sm justify-between">
                  <p className="font-semibold text-sub">
                    Match {e.matchId} // {e.stadium}
                  </p>
                  <p
                    className={`px-3 py-0.5 font-medium rounded-full ${
                      e.status === "Live"
                        ? "bg-red-500 text-white"
                        : e.status === "Upcoming"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {e.status}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center font-bold text-lg gap-1">
                      <img
                        src={`https://flagcdn.com/w40/${e.teams[0].countryCode.toLowerCase()}.png`}
                        alt={e.teams[0].countryCode}
                        className="h-4"
                      />
                      {e.teams[0].shortName}
                    </div>
                    <p className="text-sm text-primary">
                      {e.teams[0].score} ({e.teams[0].overs})
                    </p>
                  </div>
                  <p className="font-bold text-gray-400 text-lg">vs</p>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center font-bold text-lg gap-1">
                      <img
                        src={`https://flagcdn.com/w40/${e.teams[1].countryCode.toLowerCase()}.png`}
                        alt={e.teams[1].countryCode}
                        className="h-4"
                      />
                      {e.teams[1].shortName}
                    </div>
                    <p className="text-sm text-primary">
                      {e.teams[1].score} ({e.teams[1].overs})
                    </p>
                  </div>
                </div>

                {e.status === "Live" ? (
                  <button className="bg-primary text-white py-1 rounded mt-2.5 font-semibold text-center w-full">
                    See live updates
                  </button>
                ) : (
                  <div className="flex justify-between pt-1 mt-2.5 border-t border-dashed border-gray-400">
                    <button className="flex items-center cursor-pointer gap-2">
                      See Updates <FaChevronRight size={10} />
                    </button>
                    <button className="flex items-center cursor-pointer gap-2">
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
          <h1 className="text-xl font-bold text-primary">Featured Videos</h1>
          <p className="flex text-sm gap-2 items-center">
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar whitespace-nowrap px-4">
          {featuredVids.map((e, i) => (
            <div key={i} className="shrink-0 w-[23vw]">
              <img src={e} className="w-full rounded-lg" alt="" />
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
          <div className="flex-1 flex flex-col gap-14">
            {blogs.map((e, i) => (
              <div key={i} className="flex gap-5">
                <img src={e.img} alt="" />
                <div className="mt-5">
                  <p className="text-2xl font-bold ">{e.title}</p>
                  <div className="flex mt-5 items-center gap-2">
                    <p>By {e.by}</p>
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                    <p className="text-gray-400">{e.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <img src={blogs4} alt="" />
            <p className="text-4xl px-3 mt-2 font-bold">{blogs[0].title}</p>
            <div className="mt-4 flex items-center gap-3 px-3">
              <img
                className="h-10 w-10 object-cover rounded-full"
                src="https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
                alt=""
              />
              <p>By Mark Canto</p>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
              <p className="text-gray-400">March 29, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
