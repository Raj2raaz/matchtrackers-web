import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp, FaBars, FaTimes } from "react-icons/fa";
import navLogo from "../assets/navLogo.svg";
import favicon from "../assets/favicon.svg";
import { getNavLinks } from "../api/Home";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef({});
  const mobileMenuRef = useRef();

  useEffect(() => {
    getData();

    // Close dropdown when clicking outside
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
    event.stopPropagation(); // Prevent click from propagating to document
    console.log(`Toggling dropdown: ${menu}`);
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeDropdown = () => {
    console.log("Closing dropdown");
    setOpenDropdown(null);
    setMobileMenuOpen(false); // Ensure mobile menu also closes
  };

  const handleNavLinkClick = (e, path) => {
    e.preventDefault(); // Prevent default link behavior
    console.log(`Navigating to: ${path}`);
    navigate(path);
    closeDropdown(); // Close dropdown after navigation
  };

  const toggleMobileMenu = () => {
    console.log(`Toggling mobile menu: ${mobileMenuOpen ? "close" : "open"}`);
    setMobileMenuOpen((prev) => !prev);
  };

  // Shared dropdown content components
  const SeriesDropdown = () => (
    <div className="max-h-96 overflow-y-auto py-2 text-black bg-white rounded-md ">
      {navLinks?.series?.seriesMapProto?.length > 0 ? (
        navLinks?.series?.seriesMapProto.flatMap((month) => (
          <React.Fragment key={month.date}>
            <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
              {month.date}
            </div>
            {month.series.map((match, index) => (
              <Link
                key={index}
                to={`/schedules/${match.id}`}
                className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
                onClick={(e) => handleNavLinkClick(e, `/schedules/${match.id}`)} // Use handleNavLinkClick
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
    <div className="py-2 bg-white rounded-md text-black ">
      <Link
        to="/match-list/recent"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/match-list/recent")} // Use handleNavLinkClick
      >
        Recent
      </Link>
      <Link
        to="/match-list/live"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/match-list/live")} // Use handleNavLinkClick
      >
        Live
      </Link>
      <Link
        to="/match-list/upcoming"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/match-list/upcoming")} // Use handleNavLinkClick
      >
        Upcoming
      </Link>
    </div>
  );

  const RankingsDropdown = () => (
    <div className="py-2 bg-white rounded-md text-black ">
      <Link
        to="/rankings/odi"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/rankings/odi")} // Use handleNavLinkClick
      >
        ODI
      </Link>
      <Link
        to="/rankings/test"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/rankings/test")} // Use handleNavLinkClick
      >
        Test
      </Link>
      <Link
        to="/rankings/t20"
        className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-150 text-sm"
        onClick={(e) => handleNavLinkClick(e, "/rankings/t20")} // Use handleNavLinkClick
      >
        T20
      </Link>
    </div>
  );

  const NewsDropdown = () => (
    <div className="py-2 max-h-96 overflow-y-auto text-black bg-white rounded-md ">
      {navLinks?.news?.slice(0, 7).map((e, i) => (
        <Link
          key={i}
          to={`/news/${e.id}`}
          className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-0"
          onClick={(event) => handleNavLinkClick(event, `/news/${e.id}`)} // Use handleNavLinkClick
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
          to="/news"
          className="block px-4 py-2 text-center text-primary text-sm font-medium hover:bg-blue-50"
          onClick={(e) => handleNavLinkClick(e, "/news")} // Use handleNavLinkClick
        >
          View All News
        </Link>
      )}
    </div>
  );

  const SchedulesDropdown = () => (
    <div className="py-2 max-h-96 overflow-y-auto text-black bg-white rounded-md ">
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
                  to={`/match/${match.matchId}`}
                  className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150"
                  onClick={(e) =>
                    handleNavLinkClick(e, `/match/${match.matchId}`)
                  } // Use handleNavLinkClick
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
      <Link
        to="/schedules"
        className="block px-4 py-2 text-center text-primary text-sm font-medium hover:bg-blue-50"
        onClick={(e) => handleNavLinkClick(e, "/schedules")} // Use handleNavLinkClick
      >
        View Full Schedule
      </Link>
    </div>
  );

  return (
    <div className="sticky z-40 top-0 w-full left-0 shadow-md">
      <div className="bg-gradient-to-r from-secondary to-secondary/90 px-4 md:px-12 lg:px-24 py-3 text-white flex w-full justify-between items-center relative">
        {" "}
        {/* Added relative positioning */}
        <img
          onClick={() => navigate("/")}
          className="h-8 md:h-8 cursor-pointer transition-transform hover:scale-105"
          src={navLogo}
          alt="Logo"
        />
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none z-50 relative" // Increased z-index and relative
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 md:gap-8 font-medium items-center">
          {/* Series Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.series = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative" // Added z-index and relative
              onClick={(event) => toggleDropdown("series", event)} // Added event argument
            >
              <span>Series</span>
              <span className="transition-transform duration-200">
                {openDropdown === "series" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "series" && (
              <div className="absolute top-full right-0 mt-1 w-64 origin-top-right z-50">
                <SeriesDropdown />
              </div>
            )}
          </div>

          {/* Matches Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.matches = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative" // Added z-index and relative
              onClick={(event) => toggleDropdown("matches", event)} // Added event argument
            >
              <span>Matches</span>
              <span className="transition-transform duration-200">
                {openDropdown === "matches" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "matches" && (
              <div className="absolute top-full right-0 mt-1 w-40 origin-top-right z-50">
                <MatchesDropdown />
              </div>
            )}
          </div>

          {/* Rankings Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.players = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative" // Added z-index and relative
              onClick={(event) => toggleDropdown("players", event)} // Added event argument
            >
              <span>Rankings</span>
              <span className="transition-transform duration-200">
                {openDropdown === "players" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "players" && (
              <div className="absolute top-full right-0 mt-1 w-40 origin-top-right z-50">
                <RankingsDropdown />
              </div>
            )}
          </div>

          {/* News Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.news = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative" // Added z-index and relative
              onClick={(event) => toggleDropdown("news", event)} // Added event argument
            >
              <span>News</span>
              <span className="transition-transform duration-200">
                {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "news" && (
              <div className="absolute top-full right-0 mt-1 w-72 origin-top-right z-50">
                <NewsDropdown />
              </div>
            )}
          </div>

          {/* Schedules Dropdown */}
          <div
            className="relative"
            ref={(el) => (dropdownRefs.current.schedules = el)}
          >
            <div
              className="capitalize flex gap-1 items-center cursor-pointer py-2 px-1 hover:text-primary transition-colors duration-200 z-10 relative" // Added z-index and relative
              onClick={(event) => toggleDropdown("schedules", event)} // Added event argument
            >
              <span>Schedules</span>
              <span className="transition-transform duration-200">
                {openDropdown === "schedules" ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {openDropdown === "schedules" && (
              <div className="absolute top-full right-0 mt-1 w-80 origin-top-right z-50">
                <SchedulesDropdown />
              </div>
            )}
          </div>

          <div className="">
            <div
              className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
              // Added event argument
              onClick={() => navigate("/analytics")}
            >
              <span>Analytics</span>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm hover:shadow z-10 relative" // Added z-index and relative
            onClick={() => {
              if (Cookies.get("token")) {
                Cookies.remove("token");
              } else {
                navigate("/auth");
              }
            }}
          >
            {Cookies.get("token") ? "Logout" : "Login or Signup"}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div
            ref={mobileMenuRef}
            className="bg-white h-full max-w-sm overflow-y-auto shadow-xl animate-slide-in-right z-50 relative" // Increased z-index and relative
          >
            <div className="py-4 px-6 bg-secondary text-white flex justify-between items-center">
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
                className="z-50 relative"
              >
                {" "}
              </button>
            </div>

            <div className="py-4">
              {/* Mobile Accordion Menus */}
              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("series", event)} // Added event argument
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
                  <div className="bg-gray-50 border-t border-gray-100 relative z-50">
                    {" "}
                    {/* Increased z-index and relative */}
                    <SeriesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("matches", event)} // Added event argument
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
                  <div className="bg-gray-50 border-t border-gray-100 relative z-50">
                    {" "}
                    {/* Increased z-index and relative */}
                    <MatchesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("players", event)} // Added event argument
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
                  <div className="bg-gray-50 border-t border-gray-100 relative z-50">
                    {" "}
                    {/* Increased z-index and relative */}
                    <RankingsDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("news", event)} // Added event argument
                >
                  <span>News</span>
                  <span>
                    {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
                  </span>
                </div>
                {openDropdown === "news" && (
                  <div className="bg-gray-50 border-t border-gray-100 relative z-50">
                    {" "}
                    {/* Increased z-index and relative */}
                    <NewsDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  onClick={(event) => toggleDropdown("schedules", event)} // Added event argument
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
                  <div className="bg-gray-50 border-t border-gray-100 relative z-50">
                    {" "}
                    {/* Increased z-index and relative */}
                    <SchedulesDropdown />
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <div
                  className="flex justify-between items-center py-3 px-6 font-medium cursor-pointer"
                  // Added event argument
                  onClick={() => navigate("/analytics")}
                >
                  <span>Analytics</span>
                </div>
              </div>

              <div className="px-6 mt-6">
                <button
                  className="w-full py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-sm hover:shadow z-10 relative" // Increased z-index and relative
                  onClick={() => {
                    // Handle login/signup, for example
                    // navigate('/login');
                    setMobileMenuOpen(false); // Close menu after actio
                  }}
                >
                  Login or Signup
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
