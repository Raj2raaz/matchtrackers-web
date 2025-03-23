import React, { useEffect, useState } from "react";
// import data from "../rankings.json";
import { useParams } from "react-router-dom";
import apiClient from "../utils/axios";
import Image from "../components/Image";

const Rankings = () => {
  const [sortField, setSortField] = useState("rank");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredCountry, setFilteredCountry] = useState("");
  const [data, setData] = useState();
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

  return (
    <div className="p-8  mx-auto">
      <div className="bg-white  rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 ">
          <h1 className="text-3xl font-bold">ICC Cricket Rankings</h1>
          <p className="">Top Batsmen Rankings</p>
          <div>
            <button>Batsmen</button>
            <button>Bowlers</button>
            <button>All Rounders</button>
            <button>Teams</button>
          </div>
        </div>

        {data && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Filter by Country
                  </label>
                  <select
                    value={filteredCountry}
                    onChange={(e) => setFilteredCountry(e.target.value)}
                    className="p-2 border rounded-md border-gray-200 w-48"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">
                    Last Updated
                  </label>
                  <div className="text-sm text-gray-500 font-medium">
                    {data.rank[0].lastUpdatedOn}
                  </div>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Reset Filters
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full  bg-white">
                <thead>
                  <tr className="bg-gray-200 border-gray-200 border-b">
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("rank")}
                    >
                      <div className="flex items-center">
                        Rank
                        {sortField === "rank" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Player
                        {sortField === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("country")}
                    >
                      <div className="flex items-center">
                        Country
                        {sortField === "country" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("rating")}
                    >
                      <div className="flex items-center">
                        Rating
                        {sortField === "rating" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRankings.map((player, index) => (
                    <tr
                      key={player.id}
                      className={`border-b border-gray-200 hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{player.rank}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Image
                            faceImageId={player.faceImageId}
                            className="h-6 w-6 rounded-full"
                          />
                          <div className="font-medium">{player.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{player.country}</td>
                      <td className="py-3 px-4 font-medium">{player.rating}</td>
                      <td className="py-3 px-4">
                        {player.trend === "Flat" && (
                          <span className="text-gray-500">➖</span>
                        )}
                        {player.trend === "Up" && (
                          <span className="text-green-500">⬆️</span>
                        )}
                        {player.trend === "Down" && (
                          <span className="text-red-500">⬇️</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              Data source: {data.appIndex.seoTitle} | {data.appIndex.webURL}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;
