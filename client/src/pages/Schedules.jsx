import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  Filter,
  X,
  Star,
  Clock,
  Trophy,
  Search,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cricApiClient as apiClient } from "../utils/axios";
import Image from "../components/Image";
import useCricbuzzStore from "../store/cricket";
import { formatTimeAgo } from "../utils/util";
import { Helmet } from "react-helmet-async";

const Schedules = () => {
  const { id } = useParams();
  const [matchDetails, setMatchDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);
  const [venues, setVenues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matchesLength, setMatchesLength] = useState(4);
  const navigate = useNavigate();
  const { news } = useCricbuzzStore();
  const [pointTable, setPointTable] = useState();
  const [sortedMatches, setSortedMatches] = useState({});

  // Function to sort matches by proximity to current date
  function sortMatchesByProximity(matches) {
    const currentTime = Date.now(); // Get current timestamp

    // Sort all matches by their proximity to current time
    return matches.sort((a, b) => {
      const diffA = Math.abs(a?.matchInfo.startDate - currentTime);
      const diffB = Math.abs(b?.matchInfo.startDate - currentTime);
      return diffA - diffB;
    });
  }

  const extractVenuesAndTeams = (matchDetails) => {
    const venuesMap = new Map(); // Using Map to store venue objects by ID
    const teamsMap = new Map(); // Using Map to store team objects by ID

    // Iterate through each day's matches
    matchDetails.forEach((dayData) => {
      if (dayData.matchDetailsMap && dayData.matchDetailsMap.match) {
        // Iterate through matches for this day
        dayData.matchDetailsMap.match.forEach((matchItem) => {
          if (matchItem.matchInfo) {
            // Extract venue object
            if (matchItem.matchInfo.venueInfo) {
              const venueInfo = matchItem.matchInfo.venueInfo;
              // Use venue ID as unique key if available, otherwise use ground name
              const venueKey = venueInfo.id || venueInfo.ground;
              if (venueKey && !venuesMap.has(venueKey)) {
                venuesMap.set(venueKey, venueInfo);
              }
            }

            // Extract team1 object
            if (matchItem.matchInfo.team1) {
              const team1 = matchItem.matchInfo.team1;
              if (team1.teamId && !teamsMap.has(team1.teamId)) {
                teamsMap.set(team1.teamId, team1);
              }
            }

            // Extract team2 object
            if (matchItem.matchInfo.team2) {
              const team2 = matchItem.matchInfo.team2;
              if (team2.teamId && !teamsMap.has(team2.teamId)) {
                teamsMap.set(team2.teamId, team2);
              }
            }
          }
        });
      }
    });

    // Convert Maps to arrays of objects
    return {
      venues: Array.from(venuesMap.values()),
      teams: Array.from(teamsMap.values()),
    };
  };

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);

        const [seriesResponse, pointsTableResponse] = await Promise.all([
          apiClient.get(`/series/v1/${id}`),
          apiClient.get(`/stats/v1/series/${id}/points-table`),
        ]);

        if (pointsTableResponse.data?.pointsTable?.[0]?.pointsTableInfo) {
          setPointTable(
            pointsTableResponse.data.pointsTable[0].pointsTableInfo
          );
        }

        if (seriesResponse.data?.matchDetails) {
          setMatchDetails(seriesResponse.data.matchDetails);

          const { venues, teams } = extractVenuesAndTeams(
            seriesResponse.data.matchDetails
          );
          setVenues(venues);
          setTeams(teams);
        } else {
          setError("No match details found");
        }
      } catch (err) {
        console.error("Error fetching match details:", err);
        setError("Failed to fetch match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  // Process and sort matches whenever matchDetails, selectedTeam, or selectedVenue changes
  useEffect(() => {
    if (matchDetails.length > 0) {
      const processedMatches = processMatchesByProximity();
      setSortedMatches(processedMatches);
    }
  }, [matchDetails, selectedTeam, selectedVenue]);

  // Process matches by proximity instead of date
  const processMatchesByProximity = () => {
    // Collect all matches into a flat array
    let allMatches = [];

    matchDetails.forEach((detail) => {
      if (detail.matchDetailsMap && detail.matchDetailsMap.match) {
        const matches = detail.matchDetailsMap.match;
        allMatches = [...allMatches, ...matches];
      }
    });

    // Apply team filter if selected
    if (selectedTeam) {
      allMatches = allMatches.filter(
        (match) =>
          match.matchInfo.team1.teamName.includes(selectedTeam.teamName) ||
          match.matchInfo.team2.teamName.includes(selectedTeam.teamName)
      );
    }

    // Apply venue filter if selected
    if (selectedVenue) {
      allMatches = allMatches.filter((match) =>
        match.matchInfo.venueInfo?.ground.includes(selectedVenue.ground)
      );
    }

    // Sort all matches by proximity to current time
    const sortedAllMatches = sortMatchesByProximity(allMatches);

    // Group sorted matches by their date for display
    const matchesByDate = {};

    sortedAllMatches.forEach((match) => {
      const date = formatDate(match.matchInfo.startDate);
      if (!matchesByDate[date]) {
        matchesByDate[date] = [];
      }
      matchesByDate[date].push(match);
    });

    return matchesByDate;
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle filter clicks
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTeam(null);
    setSelectedVenue(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      {!loading && (
        <Helmet>
          <title>Match Schedules</title>
          <meta name="description" content="Match Schedules of Latest Series" />
          <meta
            property="og:title"
            content="Match Schedules | Match Trackers"
          />
          <meta property="og:description" content="Match Schedules" />
          <meta
            property="og:image"
            content="https://matchtrackers.com/favicon.svg"
          />
          <meta property="og:url" content="https://matchtrackers.com/" />
          <meta name="twitter:card" content="summary_large_image" />
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
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content section - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Filter section */}
            <div className="bg-white rounded-lg shadow p-3 mb-4">
              <div className="flex items-center mb-3">
                <Filter size={16} className="text-blue-600 mr-2" />
                <h2 className="text-gray-800 font-medium">Filter Matches</h2>
              </div>

              <div className="flex flex-wrap gap-3 mb-2">
                <div className="flex-1 relative">
                  <div
                    className="bg-gray-50 rounded-md border flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      {selectedTeam ? (
                        <>
                          <Image
                            faceImageId={selectedTeam?.imageId}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-gray-800 text-sm">
                            {selectedTeam.teamName}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">Team</span>
                      )}
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>

                  {showTeamDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-md border max-h-48 overflow-y-auto">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            setSelectedTeam(team);
                            setShowTeamDropdown(false);
                          }}
                        >
                          <Image
                            faceImageId={team?.imageId}
                            className="h-6 w-6 rounded-full"
                          />
                          <span className="text-sm">{team?.teamName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 relative">
                  <div
                    className="bg-gray-50 rounded-md border flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => setShowVenueDropdown(!showVenueDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      {selectedVenue ? (
                        <>
                          <MapPin size={14} className="text-blue-600" />
                          <span className="text-gray-800 text-sm truncate max-w-[120px]">
                            {selectedVenue.ground}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">Venue</span>
                      )}
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>

                  {showVenueDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-md border max-h-48 overflow-y-auto">
                      {venues.map((venue) => (
                        <div
                          key={venue.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedVenue(venue);
                            setShowVenueDropdown(false);
                          }}
                        >
                          <div className="font-medium text-sm">
                            {venue.ground}
                          </div>
                          <div className="text-xs text-gray-500">
                            {venue.city}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="bg-gray-50 rounded-md border px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                  onClick={clearFilters}
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            </div>

            {/* Loading and error states */}
            {loading && (
              <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
                <p className="text-gray-600 mt-4">Loading match details...</p>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
                <div className="text-red-500 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium">{error}</p>
                </div>
                <p className="text-gray-600">
                  Please try refreshing the page or check back later.
                </p>
              </div>
            )}

            {!loading && !error && Object.keys(sortedMatches).length > 0 && (
              <div>
                <div className="relative">
                  {Object.keys(sortedMatches)
                    .slice(0, matchesLength)
                    .map((dateKey) => (
                      <div key={dateKey} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar size={18} className="text-blue-600" />
                          <h3 className="text-gray-800 font-semibold">
                            {dateKey}
                          </h3>
                        </div>

                        {sortedMatches[dateKey].map((match) => {
                          const { matchInfo } = match;
                          const isCompleted =
                            matchInfo.state.toLowerCase() === "complete" ||
                            matchInfo.state.toLowerCase() === "live";
                          const isUpcoming =
                            matchInfo.state.toLowerCase() === "upcoming";

                          return (
                            <div
                              key={matchInfo.matchId}
                              className="bg-white rounded-lg shadow mb-4 overflow-hidden transition-transform hover:translate-y-[-2px]"
                            >
                              <div className="border-b border-gray-100">
                                <div className="flex justify-between items-center p-4">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`text-xs font-bold px-2 py-1 rounded ${
                                        isCompleted
                                          ? "bg-green-100 text-green-700"
                                          : isUpcoming
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {matchInfo.state.toUpperCase()}
                                    </span>
                                    <span className="text-gray-600 text-sm font-medium">
                                      {matchInfo.matchDesc}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Clock size={14} />
                                    <span>
                                      {formatTime(matchInfo.startDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    {/* Team 1 */}
                                    <div className="flex items-center gap-3 mb-4">
                                      <Image
                                        faceImageId={matchInfo.team1.imageId}
                                        className="rounded-full h-7 w-7"
                                      />

                                      <div>
                                        <div className="text-gray-800 font-medium">
                                          {matchInfo.team1.teamName}
                                        </div>
                                        {/* Add team score when available */}
                                        {isCompleted && (
                                          <div className="text-gray-600 text-sm">
                                            167/8 (20)
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Team 2 */}
                                    <div className="flex items-center gap-3">
                                      <Image
                                        faceImageId={matchInfo.team2.imageId}
                                        className="rounded-full h-7 w-7"
                                      />
                                      <div>
                                        <div className="text-gray-800 font-medium">
                                          {matchInfo.team2.teamName}
                                        </div>
                                        {/* Add team score when available */}
                                        {isCompleted && (
                                          <div className="text-gray-600 text-sm">
                                            168/3 (18.4)
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Match status */}
                                    <div
                                      className={`text-sm mt-3 ${
                                        isCompleted
                                          ? "text-green-600 font-medium"
                                          : "text-blue-600"
                                      }`}
                                    >
                                      {matchInfo.status}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                      <MapPin
                                        size={14}
                                        className="text-gray-400"
                                      />
                                      <span>{matchInfo.venueInfo?.ground}</span>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                      <button
                                        onClick={() =>
                                          navigate(
                                            "/match/" + matchInfo.matchId
                                          )
                                        }
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                                      >
                                        Match Details
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}

                  {matchesLength < Object.keys(sortedMatches).length && (
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>

                {matchesLength < Object.keys(sortedMatches).length ? (
                  <button
                    className="text-blue-600 mx-auto w-full cursor-pointer text-sm font-medium mt-2 hover:text-blue-700"
                    onClick={() => {
                      // Add 4 more dates to display or show all if less than 4 remaining
                      const newLength = Math.min(
                        matchesLength + 4,
                        Object.keys(sortedMatches).length
                      );
                      setMatchesLength(newLength);
                    }}
                  >
                    See More
                  </button>
                ) : (
                  <button
                    className="text-blue-600 mx-auto w-full cursor-pointer text-sm font-medium mt-2 hover:text-blue-700"
                    onClick={() => {
                      // Reset to initial count
                      setMatchesLength(4); // Adjust this initial number as needed
                    }}
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}

            {/* No matches found state */}
            {!loading && !error && Object.keys(sortedMatches).length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
                <div className="text-gray-500 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium">No matches found</p>
                </div>
                <p className="text-gray-600">
                  Try changing your filter criteria or check back later.
                </p>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar section - 1/3 width */}
          <div>
            {/* Points Table Section */}

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text w-[15rem] truncate font-bold ">
                  {
                    matchDetails[0]?.matchDetailsMap?.match[0]?.matchInfo
                      ?.seriesName
                  }{" "}
                  Points Table
                </h2>
                <Link
                  to={
                    "/points-table/" +
                    matchDetails[0]?.matchDetailsMap?.match[0]?.matchInfo
                      ?.seriesId
                  }
                  className=" text-sm flex items-center gap-1 hover:underline"
                >
                  View Full Table
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full ">
                  <thead className="">
                    <tr className="bg-gray-50 text-left ">
                      <th className="p-2 text-xs font-medium text-gray-500">
                        #
                      </th>
                      <th className="p-2 text-xs font-medium text-gray-500">
                        Team
                      </th>
                      <th className="p-2 text-xs font-medium text-gray-500 text-right">
                        M
                      </th>
                      <th className="p-2 text-xs font-medium text-gray-500 text-right">
                        W
                      </th>
                      <th className="p-2 text-xs font-medium text-gray-500 text-right">
                        L
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointTable &&
                      pointTable.slice(0, 4).map((team, index) => (
                        <tr
                          key={team.teamId}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="p-2 text-sm text-white">
                            {index + 1}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {team.teamFullName} ({team.teamName})
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-sm text-right">
                            {team.matchesPlayed}
                          </td>
                          <td className="p-2 text-sm text-right">
                            {team.matchesWon}
                          </td>
                          <td className="p-2 text-sm text-right">
                            {team.matchesLost || 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex justify-center w-full ">•••</div>
              </div>
            </div>

            {/* Latest News Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Latest News</h2>
                <a
                  href="/news"
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </a>
              </div>

              <div className="space-y-4">
                {news.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => navigate("/cricket/news/" + item.story.id)}
                    className="flex cursor-pointer gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <Image
                      faceImageId={item.story?.imageId}
                      className="h-26"
                      resolution="gthumb"
                    />
                    <div>
                      <h3 className="text-gray-800 font-medium text-sm line-clamp-2">
                        {item.story.hline}
                      </h3>
                      <p className="overflow-hidden text-xs mt-2 w-56 line-clamp-2">
                        {item.story.intro}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatTimeAgo(Number(item.story.pubTime))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
