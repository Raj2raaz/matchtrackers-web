import React, { useEffect, useState, useRef } from "react";
import navLogo from "../assets/navLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import useCricbuzzStore from "../store/mainStore";
import { getNavLinks } from "../api/Home";

export default function Navbar() {
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    getData();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const getData = async () => {
    const data = await getNavLinks();
    setNavLinks(data);
  };

  const toggleDropdown = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="sticky z-50 top-0 w-full left-0 shadow-md">
      <div className="bg-gradient-to-r from-secondary to-secondary/90 px-6 md:px-12 lg:px-24 py-3 text-white flex w-full justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="h-12 cursor-pointer transition-transform hover:scale-105"
          src={navLogo}
          alt="Logo"
        />

        <div className="flex gap-6 md:gap-8 font-medium items-center">
          {/* Series Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.series = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => toggleDropdown("series")}
            >
              <span>Series</span>
              <span className="transition-transform duration-200">
                {openDropdown === "series" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "series" && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white text-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out opacity-100 scale-100 origin-top-right">
                <div className="max-h-96 overflow-y-auto py-2">
                  {navLinks?.series?.seriesMapProto?.length > 0 ? (
                    navLinks?.series?.seriesMapProto.flatMap((month) => (
                      <>
                        <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                          {month.date}
                        </div>
                        {month.series.map((match, index) => (
                          <Link
                            key={index}
                            to={`/schedules/${match.id}`}
                            className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                            onClick={closeDropdown}
                          >
                            {match.name}
                          </Link>
                        ))}
                      </>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No series available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Matches Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.matches = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => toggleDropdown("matches")}
            >
              <span>Matches</span>
              <span className="transition-transform duration-200">
                {openDropdown === "matches" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "matches" && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white text-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out opacity-100 scale-100 origin-top-right">
                <div className="py-2">
                  <Link
                    to="/match-list/recent"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    Recent
                  </Link>
                  <Link
                    to="/match-list/live"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    Live
                  </Link>
                  <Link
                    to="/match-list/upcoming"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    Upcoming
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Rankings Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.players = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => toggleDropdown("players")}
            >
              <span>Rankings</span>
              <span className="transition-transform duration-200">
                {openDropdown === "players" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "players" && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white text-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out opacity-100 scale-100 origin-top-right">
                <div className="py-2">
                  <Link
                    to="/rankings/odi"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    ODI
                  </Link>
                  <Link
                    to="/rankings/test"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    Test
                  </Link>
                  <Link
                    to="/rankings/t20"
                    className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                    onClick={closeDropdown}
                  >
                    T20
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* News Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.news = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => toggleDropdown("news")}
            >
              <span>News</span>
              <span className="transition-transform duration-200">
                {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "news" && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-white text-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out opacity-100 scale-100 origin-top-right">
                <div className="py-2 max-h-96 overflow-y-auto">
                  {navLinks?.news?.slice(0, 7).map((e, i) => (
                    <Link
                      key={i}
                      to="/news"
                      className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
                      onClick={closeDropdown}
                    >
                      <p className="line-clamp-2 text-sm">{e.hline}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {e.date || "Recent"}
                      </p>
                    </Link>
                  ))}
                  {(!navLinks?.news || navLinks.news.length === 0) && (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No news available
                    </div>
                  )}
                  {navLinks?.news?.length > 0 && (
                    <Link
                      to="/news"
                      className="block px-4 py-2 text-center text-primary text-sm font-medium hover:bg-blue-50"
                      onClick={closeDropdown}
                    >
                      View All News
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Schedules Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.schedules = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => toggleDropdown("schedules")}
            >
              <span>Schedules</span>
              <span className="transition-transform duration-200">
                {openDropdown === "schedules" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "schedules" && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-white text-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-200 ease-in-out opacity-100 scale-100 origin-top-right">
                <div className="py-2 max-h-96 overflow-y-auto">
                  {navLinks?.schedules?.matchScheduleMap
                    ?.filter((item) => item.scheduleAdWrapper)
                    .slice(0, 6)
                    .map((item, index) => {
                      const dateInfo = item.scheduleAdWrapper.date;
                      const matches =
                        item.scheduleAdWrapper.matchScheduleList[0]
                          ?.matchInfo || [];

                      return matches.length > 0 ? (
                        <div
                          key={index}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <div className="px-4 py-2 font-medium text-xs text-gray-600 bg-gray-50">
                            {dateInfo}
                          </div>
                          {matches.map((match, mIndex) => (
                            <Link
                              key={mIndex}
                              to={`/match/${match.matchId}`}
                              className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150"
                              onClick={closeDropdown}
                            >
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  {match.matchFormat} • {match.matchDesc}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {match.venueInfo.city}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <div className="font-medium text-sm">
                                  {match.team1.teamSName} vs{" "}
                                  {match.team2.teamSName}
                                </div>
                                <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                  {new Date(
                                    Number(match.startDate)
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : null;
                    })}
                  <Link
                    to="/schedules"
                    className="block px-4 py-2 text-center text-primary text-sm font-medium hover:bg-blue-50"
                    onClick={closeDropdown}
                  >
                    View Full Schedule
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm hover:shadow">
            Login or Signup
          </button>
        </div>
      </div>
    </div>
  );
}
