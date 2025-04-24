import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import navLogo from "../assets/navLogo.svg";
import favicon from "../assets/favicon.svg";
import { getNavLinks } from "../api/Home";
import Cookies from "js-cookie";
import useMainStore from "../store/MainStore";
import { IoFootball } from "react-icons/io5";
import { TbCricket } from "react-icons/tb";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState("cricket");
  const { content, setContent, refresh, refreshNow } = useMainStore();
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef();
  const [isHovering, setIsHovering] = useState(null);

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

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, mobileMenuOpen]);

  const getData = async () => {
    try {
      const data = await getNavLinks();
      setNavLinks(data);
    } catch (error) {
      console.error("Failed to fetch nav links:", error);
      // Consider setting an error state to display a message to the user
    }
  };

  const toggleDropdown = (menu, event) => {
    if (event) event.stopPropagation(); // Prevent click from propagating to document
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false); // Ensure mobile menu also closes
  };

  const handleNavLinkClick = (e, path) => {
    e.preventDefault(); // Prevent default link behavior
    navigate(path);
    closeDropdown(); // Close dropdown after navigation
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMouseEnter = (menu) => {
    setIsHovering(menu);
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    setIsHovering(null);
    // Only close if not clicked open
    if (!openDropdown || openDropdown === isHovering) {
      setOpenDropdown(null);
    }
  };

  // Shared dropdown content components
  const SeriesDropdown = () => (
    <div className="max-h-96 overflow-y-auto z-70 py-2 text-black bg-white rounded-md shadow-lg">
      {navLinks?.series?.seriesMapProto?.length > 0 ? (
        navLinks?.series?.seriesMapProto.flatMap((month) => (
          <React.Fragment key={month.date}>
            <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
              {month.date}
            </div>
            {month.series.map((match, index) => (
              <Link
                key={index}
                to={`/cricket/schedules/${match.id}`}
                className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                onClick={(e) =>
                  handleNavLinkClick(e, `/cricket/schedules/${match.id}`)
                }
              >
                {match.name}
              </Link>
            ))}
          </React.Fragment>
        ))
      ) : (
        <div className="px-4 py-3 text-gray-500 text-sm">
          No series available
        </div>
      )}
    </div>
  );

  const MatchesDropdown = () => (
    <div className="py-2 bg-white z-70 rounded-md text-black shadow-lg">
      <Link
        to="/cricket/match-list/recent"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/cricket/match-list/recent")}
      >
        Recent
      </Link>
      <Link
        to="/cricket/match-list/live"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/cricket/match-list/live")}
      >
        Live
      </Link>
      <Link
        to="/cricket/match-list/upcoming"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/cricket/match-list/upcoming")}
      >
        Upcoming
      </Link>
    </div>
  );

  const RankingsDropdown = () => (
    <div className="py-2 bg-white z-70 rounded-md text-black shadow-lg">
      <Link
        to="/cricket/rankings/odi"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "./cricket/rankings/odi")}
      >
        ODI
      </Link>
      <Link
        to="/cricket/rankings/test"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/cricket/rankings/test")}
      >
        Test
      </Link>
      <Link
        to="/cricket/rankings/t20"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/cricket/rankings/t20")}
      >
        T20
      </Link>
    </div>
  );

  const NewsDropdown = () => (
    <div className="py-2 max-h-96 z-70 overflow-y-auto text-black bg-white rounded-md shadow-lg">
      {navLinks?.news?.slice(0, 7).map((e, i) => (
        <Link
          key={i}
          to={`/cricket/news/${e.id}`}
          className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
          onClick={(event) =>
            handleNavLinkClick(event, `/cricket/news/${e.id}`)
          }
        >
          <p className="line-clamp-2 text-sm">{e.hline}</p>
          <p className="text-xs text-gray-500 mt-1">{e.date || "Recent"}</p>
        </Link>
      ))}
      {(!navLinks?.news || navLinks.news.length === 0) && (
        <div className="px-4 py-3 text-gray-500 text-sm">No news available</div>
      )}
      {navLinks?.news?.length > 0 && (
        <Link
          to="/cricket/all-news"
          className="block px-4 py-2 text-center text-primary text-sm font-medium hover:bg-blue-50"
          onClick={(e) => handleNavLinkClick(e, "/cricket/all-news")}
        >
          View All News
        </Link>
      )}
    </div>
  );

  const SchedulesDropdown = () => (
    <div className="py-2 max-h-96 z-70 overflow-y-auto text-black bg-white rounded-md shadow-lg">
      {navLinks?.schedules?.matchScheduleMap
        ?.filter((item) => item.scheduleAdWrapper)
        .slice(0, 6)
        .map((item, index) => {
          const dateInfo = item.scheduleAdWrapper.date;
          const matches =
            item.scheduleAdWrapper.matchScheduleList[0]?.matchInfo || [];

          return matches.length > 0 ? (
            <div key={index} className="border-b border-gray-100 last:border-0">
              <div className="px-4 py-2 font-medium text-xs text-gray-600 bg-gray-50">
                {dateInfo}
              </div>
              {matches.map((match, mIndex) => (
                <Link
                  key={mIndex}
                  to={`/cricket/match/${match.matchId}`}
                  className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150"
                  onClick={(e) =>
                    handleNavLinkClick(e, `/cricket/match/${match.matchId}`)
                  }
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
                      {match.team1.teamSName} vs {match.team2.teamSName}
                    </div>
                    <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {new Date(Number(match.startDate)).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null;
        })}
    </div>
  );

  useEffect(() => {
    const url = window.location.pathname;

    if (url.split("/")[1] === "cricket") setContent("cricket");
    if (url.split("/")[1] === "football") setContent("football");
  }, [window.location.pathname]);

  return (
    <div className="sticky z-50 top-0 w-full left-0 shadow-md">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 md:px-6 lg:px-24 py-3 text-white flex w-full justify-between items-center relative">
        <img
          onClick={() => navigate("/cricket")}
          className="h-8 md:h-8 cursor-pointer transition-transform hover:scale-105"
          src={navLogo}
          alt="Logo"
        />

        <div className="bg-white rounded-full flex items-center p-0.5 shadow-sm ">
          <button
            onClick={() => {
              if (
                !window.location.pathname
                  .replace(/\/+$/, "")
                  .endsWith("/analytics")
              ) {
                setContent("cricket");
                navigate("/cricket");
              } else {
                setContent("cricket");
                navigate("/cricket/analytics");
              }
            }}
            className={`flex items-center cursor-pointer justify-center w-8 h-8 rounded-full transition-all duration-200 ${
              content === "cricket"
                ? "bg-blue-600 text-white"
                : "text-blue-800 hover:bg-gray-100"
            }`}
            aria-label="Switch to Cricket"
          >
            <TbCricket size={20} />
          </button>

          <button
            onClick={() => {
              if (
                !window.location.pathname
                  .replace(/\/+$/, "")
                  .endsWith("/analytics")
              ) {
                setContent("football");
                navigate("/football");
              } else {
                setContent("football");
                navigate("/football/analytics");
              }
            }}
            className={`flex items-center cursor-pointer justify-center w-8 h-8 rounded-full transition-all duration-200 ${
              content === "football"
                ? "bg-blue-600 text-white"
                : "text-blue-800 hover:bg-gray-100"
            }`}
            aria-label="Switch to Football"
          >
            <IoFootball size={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none z-70 relative"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-3 md:gap-6 lg:gap-8 font-medium items-center text-sm md:text-base">
          {/* Series Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.series = el)}
            onMouseEnter={() => handleMouseEnter("series")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative"
              onClick={(event) => toggleDropdown("series", event)}
            >
              <span>Series</span>
              <span className="transition-transform duration-200">
                {openDropdown === "series" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "series" && (
              <div className="absolute top-full right-0 mt-1 w-64 origin-top-right z-70">
                <SeriesDropdown />
              </div>
            )}
          </div>

          {/* Matches Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.matches = el)}
            onMouseEnter={() => handleMouseEnter("matches")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative"
              onClick={(event) => toggleDropdown("matches", event)}
            >
              <span>Matches</span>
              <span className="transition-transform duration-200">
                {openDropdown === "matches" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "matches" && (
              <div className="absolute top-full right-0 mt-1 w-40 origin-top-right z-70">
                <MatchesDropdown />
              </div>
            )}
          </div>

          {/* Rankings Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.players = el)}
            onMouseEnter={() => handleMouseEnter("players")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative"
              onClick={(event) => toggleDropdown("players", event)}
            >
              <span>Rankings</span>
              <span className="transition-transform duration-200">
                {openDropdown === "players" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "players" && (
              <div className="absolute top-full right-0 mt-1 w-40 origin-top-right z-70">
                <RankingsDropdown />
              </div>
            )}
          </div>

          {/* News Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.news = el)}
            onMouseEnter={() => handleMouseEnter("news")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative"
              onClick={(event) => toggleDropdown("news", event)}
            >
              <span>News</span>
              <span className="transition-transform duration-200">
                {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "news" && (
              <div className="absolute top-full right-0 mt-1 w-72 origin-top-right z-70">
                <NewsDropdown />
              </div>
            )}
          </div>

          {/* Schedules Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.schedules = el)}
            onMouseEnter={() => handleMouseEnter("schedules")}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative"
              onClick={(event) => toggleDropdown("schedules", event)}
            >
              <span>Schedules</span>
              <span className="transition-transform duration-200">
                {openDropdown === "schedules" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "schedules" && (
              <div className="absolute top-full right-0 mt-1 w-80 origin-top-right z-70">
                <SchedulesDropdown />
              </div>
            )}
          </div>

          <div className="">
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200"
              onClick={() => {
                navigate("/cricket/analytics");
                closeDropdown();
              }}
            >
              <span>Analytics</span>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm hover:shadow z-10 relative flex items-center gap-2"
            onClick={() => {
              if (Cookies.get("token")) {
                Cookies.remove("token");
                navigate("/cricket/");
                refreshNow();
              } else {
                navigate("/auth");
              }
            }}
            key={refresh}
          >
            {Cookies.get("token") ? (
              <FaUser className="text-lg" />
            ) : (
              "Login or Signup"
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0004] bg-opacity-50 z-[80] sm:hidden">
          <div
            ref={mobileMenuRef}
            className="bg-white h-full w-full overflow-y-auto shadow-xl animate-slide-in-right z-[80]"
          >
            <div className="py-4 px-6 bg-secondary relative z-70 text-white flex justify-between items-center">
              <img
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="h-8 cursor-pointer"
                src={navLogo}
                alt="Logo"
              />
              <button
                onClick={toggleMobileMenu}
                aria-label="Close Menu"
                className="text-white focus:outline-none z-60 relative"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="py-4">
              {/* Mobile Accordion Menus */}
              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("series", event)}
                >
                  <span>Series</span>
                  <span>
                    {openDropdown === "series" ? (
                      <FaAngleUp />
                    ) : (
                      <FaAngleDown />
                    )}
                  </span>
                </div>
                {openDropdown === "series" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-60">
                    <SeriesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("matches", event)}
                >
                  <span>Matches</span>
                  <span>
                    {openDropdown === "matches" ? (
                      <FaAngleUp />
                    ) : (
                      <FaAngleDown />
                    )}
                  </span>
                </div>
                {openDropdown === "matches" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-60">
                    <MatchesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("players", event)}
                >
                  <span>Rankings</span>
                  <span>
                    {openDropdown === "players" ? (
                      <FaAngleUp />
                    ) : (
                      <FaAngleDown />
                    )}
                  </span>
                </div>
                {openDropdown === "players" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-60">
                    <RankingsDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("news", event)}
                >
                  <span>News</span>
                  <span>
                    {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </div>
                {openDropdown === "news" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-60">
                    <NewsDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("schedules", event)}
                >
                  <span>Schedules</span>
                  <span>
                    {openDropdown === "schedules" ? (
                      <FaAngleUp />
                    ) : (
                      <FaAngleDown />
                    )}
                  </span>
                </div>
                {openDropdown === "schedules" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-60">
                    <SchedulesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={() => {
                    navigate("/cricket/analytics");
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>Analytics</span>
                </div>
              </div>

              <div className="px-6 mt-6">
                <button
                  className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm hover:shadow z-10 relative flex items-center gap-2"
                  onClick={() => {
                    if (Cookies.get("token")) {
                      Cookies.remove("token");
                      refreshNow();
                    } else {
                      navigate("/auth");
                    }
                  }}
                  key={refresh}
                >
                  {Cookies.get("token") ? (
                    <FaUser className="text-lg" />
                  ) : (
                    "Login or Signup"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
