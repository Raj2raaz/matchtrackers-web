import React, { useEffect, useState } from "react";
import { Trophy, Calendar, Globe, Users } from "lucide-react";
import { cricApiClient as apiClient } from "../utils/axios";
import Image from "../components/Image";
import { useNavigate, useParams } from "react-router-dom";
import TopNews from "../components/TopNews";
import { Helmet } from "react-helmet-async";

const CricketScoresDashboard = ({}) => {
  const [activeTab, setActiveTab] = useState("League");
  const navigate = useNavigate();
  const { type } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await apiClient.get(`/matches/v1/${type}`);
        // Handle the case where response.data is empty or doesn't have the expected structure
        if (
          !response.data ||
          !response.data.typeMatches ||
          response.data.typeMatches.length === 0
        ) {
          setData({
            filters: {
              matchType: ["League", "International", "Domestic", "Women"],
            },
            typeMatches: [],
          });
        } else {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const formatOvers = (overs) => {
    if (!overs && overs !== 0) return "-";
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    if (balls === 10) {
      return `${fullOvers + 1}.0`;
    }
    return `${fullOvers}.${balls}`;
  };

  const getScoreDisplay = (score) => {
    if (!score || !score.inngs1) return "-";
    const { runs, wickets, overs } = score.inngs1;
    return `${runs || 0}${
      wickets !== undefined ? `/${wickets}` : ""
    } (${formatOvers(overs)})`;
  };

  const renderMatchCard = (match) => {
    const { matchInfo, matchScore } = match;
    const { team1, team2, status, venueInfo, matchFormat, state } = matchInfo;

    return (
      <div
        key={matchInfo.matchId}
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 
            dark:bg-gray-800 dark:border-gray-700"
      >
        <Helmet>
          <title>Match Trackers | Live Scores, Stats & News</title>
          <meta
            name="description"
            content="Track live matches, player stats, rankings, and news across all formats and leagues at Match Trackers."
          />

          <meta
            property="og:title"
            content="Match Trackers | Live Scores, Stats & News"
          />
          <meta
            property="og:description"
            content="Track live matches, player stats, rankings, and news across all formats and leagues."
          />
          <meta
            property="og:image"
            content="https://matchtrackers.com/favicon.svg"
          />
          <meta property="og:url" content="https://matchtrackers.com" />
          <meta property="og:type" content="website" />

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

        <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-300">
            {matchInfo.seriesName} -
            <span className="text-xs px-2 py-1 rounded-full border border-gray-400 dark:border-gray-600 dark:text-gray-200">
              {matchFormat}
            </span>
          </div>
          <div className="text-xs text-gray-500 flex items-center dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(matchInfo.startDate)}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start justify-between">
          <div className="flex flex-col gap-3 justify-between w-full sm:w-auto">
            <div className="flex gap-4 items-center">
              <div className="font-semibold flex gap-3 items-center text-lg dark:text-white">
                <Image
                  faceImageId={team1.imageId}
                  className="h-7 w-7 rounded-full"
                />
                {team1.teamName}
              </div>
              <div className="text-sm dark:text-gray-300">
                {getScoreDisplay(matchScore?.team1Score)}
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="font-semibold flex gap-3 items-center text-lg dark:text-white">
                <Image
                  faceImageId={team2.imageId}
                  className="h-7 w-7 rounded-full"
                />
                {team2.teamName}
              </div>
              <div className="text-sm dark:text-gray-300">
                {getScoreDisplay(matchScore?.team2Score)}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 sm:mt-1 flex items-center dark:text-gray-400">
            <Globe className="w-3 h-3 mr-1" />
            {venueInfo.ground}, {venueInfo.city}
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-end justify-between">
          <div
            className={`font-medium text-sm ${
              state === "Complete"
                ? "text-green-600 dark:text-green-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {status}
          </div>
          <div className="mt-2 sm:mt-0">
            <button
              onClick={() => navigate("/cricket/match/" + matchInfo.matchId)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium 
                 hover:bg-blue-700 
                 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Match Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSeries = (seriesMatch) => {
    if (!seriesMatch.seriesAdWrapper || !seriesMatch.seriesAdWrapper.matches) {
      return null;
    }

    return (
      <div key={seriesMatch.seriesAdWrapper.seriesId} className="mb-6">
        <h3 className="text-lg font-semibold mb-3 border-b pb-2 dark:text-white dark:border-gray-700">
          {seriesMatch.seriesAdWrapper.seriesName}
        </h3>
        {seriesMatch.seriesAdWrapper.matches.length > 0 ? (
          <div>
            {seriesMatch.seriesAdWrapper.matches.map((match) =>
              renderMatchCard(match)
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center dark:bg-gray-800">
            <p className="text-gray-500 font-medium dark:text-gray-300">
              No matches available for this series
            </p>
            <p className="text-gray-400 text-sm mt-1 dark:text-gray-500">
              Check back later for updates
            </p>
          </div>
        )}
      </div>
    );
  };

  const getTabIcon = (matchType) => {
    switch (matchType) {
      case "League":
        return <Trophy className="w-4 h-4" />;
      case "International":
        return <Globe className="w-4 h-4" />;
      case "Domestic":
        return <Calendar className="w-4 h-4" />;
      case "Women":
        return <Users className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const renderEmptyState = (matchType) => {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 my-4 
                    dark:bg-gray-800"
      >
        <div className="text-gray-400 mb-4 dark:text-gray-500">
          {getTabIcon(matchType)}
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:text-gray-200">
          No {matchType} Matches Available
        </h3>
        <p className="text-gray-500 text-center max-w-md dark:text-gray-400">
          There are currently no {matchType.toLowerCase()} cricket matches
          scheduled or in progress. Please check back later for updates.
        </p>
      </div>
    );
  };

  const renderNoMatchesForType = () => {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 my-4 
                dark:bg-gray-800"
      >
        <div className="text-gray-400 mb-4 dark:text-gray-500">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2 dark:text-gray-200">
          No {type.toUpperCase()} Matches Available
        </h3>
        <p className="text-gray-500 text-center max-w-md dark:text-gray-400">
          There are currently no {type.toLowerCase()} cricket matches available.
          Try checking other match types or come back later.
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 
                  border-blue-500 dark:border-blue-400"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4 text-center">
        <div
          className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-8 
                  dark:bg-red-900 dark:border-red-700"
        >
          <h2 className="text-xl font-bold text-red-600 mb-2 dark:text-red-400">
            Unable to Load Matches
          </h2>
          <p className="text-gray-700 mb-4 dark:text-gray-300">
            We encountered an error while loading the cricket matches. Please
            try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium 
                 hover:bg-blue-700 
                 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Handle case when data is empty or there are no matches for the current type
  if (!data || !data.typeMatches || data.typeMatches.length === 0) {
    return (
      <div className="mx-auto p-4">
        <header className="mb-3">
          <h1 className="text-2xl capitalize font-bold mb-2">
            {type} Cricket Matches
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with the latest cricket matches from around the world
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <div
              className="bg-white border border-gray-300 rounded-lg shadow-lg 
                          dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="p-4 dark:text-gray-200">
                {renderNoMatchesForType()}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <TopNews length={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <header className="mb-3">
        <h1 className="text-2xl capitalize font-bold mb-2 text-gray-900 dark:text-gray-100">
          {type} Cricket Matches
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Stay updated with the latest cricket matches from around the world
        </p>
      </header>

      <div className="flex gap-2 py-4 overflow-x-auto">
        {data?.filters?.matchType?.map((type) => (
          <button
            key={type}
            className={`py-2 px-4 text-sm rounded-md whitespace-nowrap ${
              activeTab === type
                ? "bg-blue-900 text-white dark:bg-blue-600 dark:text-white"
                : "border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-200"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <div
            className="bg-white border border-gray-300 rounded-lg shadow-lg 
                      dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="p-4">
              {data?.typeMatches?.map((typeMatch) => (
                <div
                  key={typeMatch.matchType}
                  className={
                    activeTab === typeMatch.matchType ? "block" : "hidden"
                  }
                >
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    {typeMatch.matchType} Matches
                  </h2>
                  {typeMatch.seriesMatches
                    .filter((match) => match.seriesAdWrapper)
                    .map((seriesMatch) => renderSeries(seriesMatch))}
                  {data &&
                    data.typeMatches &&
                    data.typeMatches.length > 0 &&
                    data.typeMatches.filter((tm) => tm.matchType === activeTab)
                      .length > 0 &&
                    data.typeMatches
                      .filter((tm) => tm.matchType === activeTab)[0]
                      .seriesMatches.filter(
                        (match) =>
                          match.seriesAdWrapper &&
                          match.seriesAdWrapper.matches &&
                          match.seriesAdWrapper.matches.length > 0
                      ).length === 0 &&
                    renderEmptyState(typeMatch.matchType)}
                </div>
              ))}
              {data &&
                !data.typeMatches.some(
                  (type) => type.matchType === activeTab
                ) &&
                renderEmptyState(activeTab)}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <TopNews length={8} />
        </div>
      </div>
    </div>
  );
};

export default CricketScoresDashboard;
