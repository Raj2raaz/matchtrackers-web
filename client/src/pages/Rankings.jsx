import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cricApiClient as apiClient } from "../utils/axios";
import Image from "../components/Image";

const Rankings = () => {
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredCountry, setFilteredCountry] = useState("");
  const [data, setData] = useState();
  const [activeTab, setActiveTab] = useState("Batsmen");
  const { type } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          "/stats/v1/rankings/batsmen?formatType=" + type
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [type]);

  // Extract unique countries for filter dropdown
  const countries = data && [
    ...new Set(data?.rank.map((player) => player.country)),
  ];

  // Sort and filter the rankings data
  const sortedRankings =
    data &&
    [...data?.rank]
      .filter(
        (player) => filteredCountry === "" || player.country === filteredCountry
      )
      .sort((a, b) => {
        // Handle numeric fields
        if (["rank", "rating", "points"].includes(sortField)) {
          return sortDirection === "asc"
            ? parseInt(a[sortField]) - parseInt(b[sortField])
            : parseInt(b[sortField]) - parseInt(a[sortField]);
        }
        // Handle string fields
        return sortDirection === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      });

  // Handle sort click
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilteredCountry("");
    setSortField("rank");
    setSortDirection("asc");
  };

  const tabs = ["Batsmen", "Bowlers", "All Rounders", "Teams"];

  return (
    <div className=" mx-auto p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            ICC Cricket Rankings
          </h1>
          <p className="text-gray-600 mt-1">Top {activeTab} Rankings</p>

          {/* Tab Navigation */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {data ? (
          <div className="p-4 sm:p-6">
            {/* Filters Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                  <label className="text-sm text-gray-600 font-medium block mb-1">
                    Filter by Country
                  </label>
                  <div className="relative">
                    <select
                      value={filteredCountry}
                      onChange={(e) => setFilteredCountry(e.target.value)}
                      className="p-2 pl-3 pr-8 border rounded-lg border-gray-200 w-full sm:w-48 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">All Countries</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:items-end">
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Last Updated
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {data.rank[0].lastUpdatedOn}
                  </span>
                </div>

                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Table for larger screens */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("rank")}
                    >
                      <div className="flex items-center text-gray-700 font-medium">
                        Rank
                        {sortField === "rank" && (
                          <span className="ml-1 text-blue-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center text-gray-700 font-medium">
                        Player
                        {sortField === "name" && (
                          <span className="ml-1 text-blue-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("country")}
                    >
                      <div className="flex items-center text-gray-700 font-medium">
                        Country
                        {sortField === "country" && (
                          <span className="ml-1 text-blue-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => handleSort("rating")}
                    >
                      <div className="flex items-center text-gray-700 font-medium">
                        Rating
                        {sortField === "rating" && (
                          <span className="ml-1 text-blue-600">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-gray-700 font-medium">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRankings.map((player, index) => (
                    <tr
                      key={player.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {player.rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              faceImageId={player.faceImageId}
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <div className="font-medium text-gray-800">
                            {player.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {player.country}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {player.rating}
                      </td>
                      <td className="py-3 px-4">
                        {player.trend === "Flat" && (
                          <span className="text-gray-500 inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14"
                              />
                            </svg>
                          </span>
                        )}
                        {player.trend === "Up" && (
                          <span className="text-green-500 inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </span>
                        )}
                        {player.trend === "Down" && (
                          <span className="text-red-500 inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for mobile */}
            <div className="md:hidden space-y-4">
              {sortedRankings.map((player) => (
                <div
                  key={player.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            faceImageId={player.faceImageId}
                            className="h-12 w-12 object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {player.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {player.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-xl font-bold text-blue-600">
                          {player.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 text-sm">Rank</span>
                          <span className="font-semibold text-gray-800">
                            {player.rank}
                          </span>
                          {player.trend === "Flat" && (
                            <span className="text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 12h14"
                                />
                              </svg>
                            </span>
                          )}
                          {player.trend === "Up" && (
                            <span className="text-green-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </span>
                          )}
                          {player.trend === "Down" && (
                            <span className="text-red-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              Data source: {data.appIndex.seoTitle} | {data.appIndex.webURL}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="animate-pulse flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;
