import React, { useEffect, useState } from "react";
import navLogo from "../assets/navLogo.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import useCricbuzzStore from "../store/mainStore";
import { getNavLinks } from "../api/Home";
import data from "../data.json";

export default function Navbar() {
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    getData();
  }, []);

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
    <div className="sticky z-60 top-0 w-full left-0">
      <div className="bg-secondary px-24 py-2 text-white items-center flex w-full justify-between gap-10">
        <img
          onClick={() => navigate("/")}
          className="h-16 cursor-pointer"
          src={navLogo}
          alt=""
        />
        <div className="flex gap-10 font-bold items-center">
          {/* Teams Dropdown */}
          <div className="relative">
            <div
              className="capitalize flex gap-2 items-center cursor-pointer"
              onClick={() => toggleDropdown("teams")}
            >
              Teams
              {openDropdown === "teams" ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {openDropdown === "teams" && (
              <div className="absolute top-full -right-14 mt-2 w-48 bg-white text-secondary rounded shadow-lg">
                {navLinks?.teams?.matchScheduleMap
                  ?.filter(
                    (item) =>
                      item?.scheduleAdWrapper?.matchScheduleList?.[0]
                        ?.matchInfo?.[0]
                  )
                  .map((item, index) => {
                    const matchInfo =
                      item?.scheduleAdWrapper?.matchScheduleList?.[0]
                        ?.matchInfo?.[0];
                    if (!matchInfo) return null;

                    const format = matchInfo.matchFormat || "";
                    const team1 = matchInfo.team1?.teamSName || "";
                    const team2 = matchInfo.team2?.teamSName || "";
                    const matchTitle = `${format} - ${team1} vs ${team2}`;

                    return (
                      <Link
                        key={index}
                        to="/matches/upcoming"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={closeDropdown} // Close dropdown on link click
                      >
                        {matchTitle !== " -  vs "
                          ? matchTitle
                          : "Unknown Match"}
                      </Link>
                    );
                  })}
                {(!navLinks?.teams?.matchScheduleMap ||
                  navLinks.teams.matchScheduleMap.length === 0) && (
                  <div className="px-4 py-2 text-gray-500">
                    No matches available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Matches Dropdown */}
          <div className="relative">
            <div
              className="capitalize flex gap-2 items-center cursor-pointer"
              onClick={() => toggleDropdown("matches")}
            >
              Matches
              {openDropdown === "matches" ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {openDropdown === "matches" && (
              <div className="absolute top-full -left-4 mt-2 w-29 bg-white text-secondary rounded shadow-lg">
                <Link
                  to="/matches/upcoming"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeDropdown} // Close dropdown on link click
                >
                  Recent
                </Link>
                <Link
                  to="/matches/live"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeDropdown} // Close dropdown on link click
                >
                  Live
                </Link>

                <Link
                  to="/matches/series"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeDropdown} // Close dropdown on link click
                >
                  Upcoming
                </Link>
              </div>
            )}
          </div>

          {/* Players Dropdown */}
          <div className="relative">
            <div
              className="capitalize flex gap-2 items-center cursor-pointer"
              onClick={() => toggleDropdown("players")}
            >
              Players
              {openDropdown === "players" ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {openDropdown === "players" && (
              <div className="absolute top-full -left-10 mt-2 w-48 bg-white text-secondary rounded shadow-lg">
                {data.IndianPlayers.slice(0, 6).map((e, i) => (
                  <Link
                    key={i}
                    to={"/player/" + e.profileId}
                    className="flex items-center p-2 text-sm gap-2"
                    onClick={closeDropdown} // Close dropdown on link click
                  >
                    <img
                      src={e.imageLink}
                      className="h-7 rounded-full"
                      alt=""
                    />
                    <p>{e.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* News Dropdown */}
          <div className="relative">
            <div
              className="capitalize flex gap-2 items-center cursor-pointer"
              onClick={() => toggleDropdown("news")}
            >
              News
              {openDropdown === "news" ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {openDropdown === "news" && (
              <div className="absolute top-full -left-20 mt-2 w-64 bg-white text-secondary rounded shadow-lg py-2">
                {navLinks?.news?.slice(0, 7).map((e, i) => (
                  <Link
                    key={i}
                    to={"/news"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeDropdown} // Close dropdown on link click
                  >
                    <p className="line-clamp-2 text-sm font-medium">
                      {e.hline}
                    </p>
                  </Link>
                ))}
                {(!navLinks?.news || navLinks.news.length === 0) && (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No news available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedules Dropdown */}
          <div className="relative">
            <div
              className="capitalize flex gap-2 items-center cursor-pointer"
              onClick={() => toggleDropdown("schedules")}
            >
              Schedules
              {openDropdown === "schedules" ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {openDropdown === "schedules" && (
              <div className="absolute top-full -left-20 mt-2 w-72 bg-white text-secondary rounded shadow-lg py-2">
                {navLinks?.schedules?.matchScheduleMap
                  ?.filter((item) => item.scheduleAdWrapper)
                  .slice(0, 6)
                  .map((item, index) => {
                    const dateInfo = item.scheduleAdWrapper.date;
                    const matches =
                      item.scheduleAdWrapper.matchScheduleList[0]?.matchInfo ||
                      [];

                    return matches.length > 0 ? (
                      <div key={index} className="px-4 py-2">
                        <div className="font-medium text-sm text-gray-600 mb-2">
                          {dateInfo}
                        </div>
                        {matches.map((match, mIndex) => (
                          <Link
                            key={mIndex}
                            to={`/match/${match.matchId}`}
                            className="block mb-2 pb-2 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                            onClick={closeDropdown} // Close dropdown on link click
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-xs text-gray-500">
                                {match.matchFormat} • {match.matchDesc}
                              </div>
                              <div className="text-xs text-gray-500">
                                {match.venueInfo.city}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="font-medium">
                                {match.team1.teamSName} vs{" "}
                                {match.team2.teamSName}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : null;
                  })}
              </div>
            )}
          </div>

          <button className="px-3 py-1 cursor-pointer rounded bg-primary">
            Login or Signup
          </button>
        </div>
      </div>
    </div>
  );
}
