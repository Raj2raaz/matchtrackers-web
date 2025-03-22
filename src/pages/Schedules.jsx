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
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../utils/axios";
import Image from "../components/Image";

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

  const pointsTableData = [
    {
      id: 1,
      team: "MI",
      teamName: "Mumbai Indians",
      flag: "🇮🇳",
      matches: 5,
      wins: 4,
      losses: 1,
      nrr: "+0.587",
      points: 8,
    },
    {
      id: 2,
      team: "CSK",
      teamName: "Chennai Super Kings",
      flag: "🇮🇳",
      matches: 5,
      wins: 4,
      losses: 1,
      nrr: "+0.486",
      points: 8,
    },
    {
      id: 3,
      team: "RCB",
      teamName: "Royal Challengers Bangalore",
      flag: "🇮🇳",
      matches: 5,
      wins: 3,
      losses: 2,
      nrr: "+0.234",
      points: 6,
    },
    {
      id: 4,
      team: "KKR",
      teamName: "Kolkata Knight Riders",
      flag: "🇮🇳",
      matches: 5,
      wins: 3,
      losses: 2,
      nrr: "+0.112",
      points: 6,
    },
    {
      id: 5,
      team: "DC",
      teamName: "Delhi Capitals",
      flag: "🇮🇳",
      matches: 5,
      wins: 2,
      losses: 3,
      nrr: "-0.089",
      points: 4,
    },
  ];

  const newsItems = [
    {
      id: 1,
      title:
        "Rohit Sharma likely to be rested for the upcoming match against CSK",
      image: "/api/placeholder/400/200",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Maxwell's form a concern for RCB ahead of crucial playoffs race",
      image: "/api/placeholder/400/200",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "ICC Champions Trophy 2025: India's schedule announced",
      image: "/api/placeholder/400/200",
      time: "8 hours ago",
    },
    {
      id: 4,
      title: "Auction strategy: Teams looking to strengthen bowling attacks",
      image: "/api/placeholder/400/200",
      time: "10 hours ago",
    },
    {
      id: 5,
      title: "MS Dhoni hints at playing one more season after IPL 2025",
      image: "/api/placeholder/400/200",
      time: "15 hours ago",
    },
    {
      id: 6,
      title: "Young talent shines: Top 5 uncapped players this season",
      image: "/api/placeholder/400/200",
      time: "1 day ago",
    },
  ];

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

        const response = await apiClient.get(`/series/v1/${id}`);

        if (response.data && response.data.matchDetails) {
          setMatchDetails(response.data.matchDetails);

          // Extract venues and teams when data is received
          const { venues, teams } = extractVenuesAndTeams(
            response.data.matchDetails
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

  const processMatchesByDate = () => {
    const matchesByDate = {};

    matchDetails.forEach((detail) => {
      if (detail.matchDetailsMap && detail.matchDetailsMap.match) {
        const key = detail.matchDetailsMap.key; // Date string
        const matches = detail.matchDetailsMap.match;

        if (!matchesByDate[key]) {
          matchesByDate[key] = [];
        }

        matchesByDate[key] = [...matchesByDate[key], ...matches];
      }
    });

    // Filter matches by team if a team is selected
    if (selectedTeam) {
      Object.keys(matchesByDate).forEach((date) => {
        matchesByDate[date] = matchesByDate[date].filter(
          (match) =>
            match.matchInfo.team1.teamName.includes(selectedTeam.teamName) ||
            match.matchInfo.team2.teamName.includes(selectedTeam.teamName)
        );

        // Remove date key if no matches for this team on this date
        if (matchesByDate[date].length === 0) {
          delete matchesByDate[date];
        }
      });
    }

    // Filter matches by venue if a venue is selected
    if (selectedVenue) {
      Object.keys(matchesByDate).forEach((date) => {
        matchesByDate[date] = matchesByDate[date].filter((match) =>
          match.matchInfo.venueInfo?.ground.includes(selectedVenue.ground)
        );

        // Remove date key if no matches at this venue on this date
        if (matchesByDate[date].length === 0) {
          delete matchesByDate[date];
        }
      });
    }

    return matchesByDate;
  };

  const matchesByDate = processMatchesByDate();

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
      <div className=" mx-auto ">
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

            {!loading && !error && Object.keys(matchesByDate).length > 0 && (
              <div>
                <div className="relative">
                  {Object.keys(matchesByDate)
                    .slice(0, matchesLength)
                    .map((dateKey) => (
                      <div key={dateKey} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar size={18} className="text-blue-600" />
                          <h3 className="text-gray-800 font-semibold">
                            {dateKey}
                          </h3>
                        </div>

                        {matchesByDate[dateKey].map((match) => {
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
                                      {isCompleted && (
                                        <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-100">
                                          Scorecard
                                        </button>
                                      )}
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

                  {matchesLength < Object.keys(matchesByDate).length && (
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                  )}
                </div>

                {matchesLength < Object.keys(matchesByDate).length ? (
                  <button
                    className="text-blue-600 mx-auto w-full cursor-pointer text-sm font-medium mt-2 hover:text-blue-700"
                    onClick={() => {
                      // Add 4 more dates to display or show all if less than 4 remaining
                      const newLength = Math.min(
                        matchesLength + 4,
                        Object.keys(matchesByDate).length
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
            {!loading && !error && Object.keys(matchesByDate).length === 0 && (
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
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  IPL 2025 Points Table
                </h2>
                <a
                  href="/points-table"
                  className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
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
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
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
                      <th className="p-2 text-xs font-medium text-gray-500 text-right">
                        NRR
                      </th>
                      <th className="p-2 text-xs font-medium text-gray-500 text-right">
                        PTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTableData.map((team, index) => (
                      <tr
                        key={team.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="p-2 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{team.flag}</span>
                            <span className="text-sm font-medium">
                              {team.team}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-sm text-right">
                          {team.matches}
                        </td>
                        <td className="p-2 text-sm text-right">{team.wins}</td>
                        <td className="p-2 text-sm text-right">
                          {team.losses}
                        </td>
                        <td className="p-2 text-sm text-right">{team.nrr}</td>
                        <td className="p-2 text-sm font-medium text-right">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                {newsItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-gray-800 font-medium text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {item.time}
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
