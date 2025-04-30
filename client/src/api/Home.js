import { cricApiClient as apiClient } from "../utils/axios";

// Reusable error handler
const handleApiError = (functionName, error) => {
  console.error(`Error in ${functionName}:`, error);
  return null;
};

// Fetch recent and live matches
export const getRecentMatches = async () => {
  try {
    // Fetch recent and live matches concurrently
    const [recentResponse, liveResponse, upcoming] = await Promise.all([
      apiClient.get("/matches/v1/recent"),
      apiClient.get("/matches/v1/live"),
      apiClient.get("/matches/v1/upcoming"),
    ]);

    const priority = ["League", "International", "Domestic", "Women"];

    // Helper function to extract and sort matches by priority
    const extractMatches = (data) =>
      priority.flatMap((type) =>
        (data?.typeMatches || [])
          .filter((e) => e.matchType === type)
          .flatMap((e) => e.seriesMatches)
      );

    // Extract matches using the helper function
    const recentMatches = extractMatches(recentResponse.data);
    const liveMatches = extractMatches(liveResponse.data);
    const upcomingMatches = extractMatches(upcoming.data).slice(0, 5);

    // Combine both recent and live matches
    return [...upcomingMatches, ...liveMatches, ...recentMatches];
  } catch (error) {
    return handleApiError("getRecentMatches", error);
  }
};

export const getLiveMatches = async () => {
  try {
    const matches = await getRecentMatches();
    if (!matches) return null;

    // Filter for matches related to India
    const indiaMatches = matches.flatMap((e) => {
      if (!e.seriesAdWrapper) return [];

      return e.seriesAdWrapper.matches.filter((f) => {
        const team1 = f.matchInfo?.team1?.teamName?.toLowerCase() || "";
        const team2 = f.matchInfo?.team2?.teamName?.toLowerCase() || "";
        const seriesName = f.matchInfo?.seriesName?.toLowerCase() || "";

        return (
          seriesName.includes("india") ||
          team1.includes("india") ||
          team2.includes("india")
        );
      });
    });

    // Fetch commentary for each match with proper error handling
    let upcomingCount = 0;

    const matchesWithCommentary = await Promise.all(
      indiaMatches.map(async (match) => {
        const state = match.matchInfo.state;

        // Skip if more than 4 upcoming matches
        if (state === "Upcoming") {
          if (upcomingCount >= 2) {
            return null; // Skip this match
          }
          upcomingCount++;
        }

        try {
          const matchId = match.matchInfo.matchId;
          const response = await apiClient.get(`/mcenter/v1/${matchId}/comm`);
          return { ...match, commentary: response.data };
        } catch (error) {
          console.error(
            `Failed to fetch commentary for match ${match.matchInfo.matchId}`
          );
          return { ...match, commentary: null };
        }
      })
    );

    // Remove the nulls (matches skipped due to "Upcoming" limit)
    const filteredMatches = matchesWithCommentary.filter(Boolean);

    return filteredMatches;
  } catch (error) {
    return handleApiError("getLiveMatches", error);
  }
};

// Fetch trending players
export const getTrendingPlayers = async () => {
  try {
    const response = await apiClient.get("/stats/v1/player/trending");
    return response.data;
  } catch (error) {
    return handleApiError("getTrendingPlayers", error);
  }
};

// Fetch gallery images
export const getGalaryImages = async () => {
  try {
    const response = await apiClient.get("/photos/v1/index");
    const photoGalleries = response.data.photoGalleryInfoList || [];

    if (photoGalleries.length === 0) return [];

    const galleries = photoGalleries
      .filter((e) => e.photoGalleryInfo)
      .map((gallery) => ({
        headline: gallery.photoGalleryInfo.headline,
        galleryId: gallery.photoGalleryInfo.galleryId,
        images: [],
      }));

    // Fetch images for each gallery
    await Promise.all(
      galleries.map(async (gallery) => {
        try {
          const galleryResponse = await apiClient.get(
            `/photos/v1/detail/${gallery.galleryId}`
          );
          gallery.images = galleryResponse.data.photoGalleryDetails.map(
            (img) => img.imageId
          );
        } catch (error) {
          console.error(
            `Failed to fetch images for gallery ${gallery.galleryId}`
          );
          // Keep empty images array on error
        }
      })
    );

    return galleries;
  } catch (error) {
    return handleApiError("getGalaryImages", error);
  }
};

// Filter valid stories helper
const filterValidStories = (data) =>
  (data?.storyList || []).filter((e) => e.story);

// Fetch news
export const getNews = async () => {
  try {
    const response = await apiClient.get("/news/v1/index");
    return filterValidStories(response.data);
  } catch (error) {
    return handleApiError("getNews", error);
  }
};

// Fetch editor picks
export const getEditorPicks = async () => {
  try {
    const response = await apiClient.get("/news/v1/cat/2");
    return filterValidStories(response.data);
  } catch (error) {
    return handleApiError("getEditorPicks", error);
  }
};

// Fetch player information
export const getPlayerInfo = async (id) => {
  if (!id) return null;

  try {
    const endpoints = [
      `/stats/v1/player/${id}`, // Player Info
      `/stats/v1/player/${id}/batting`, // Batting Stats
      `/stats/v1/player/${id}/bowling`, // Bowling Stats
      `/stats/v1/player/${id}/career`, // Career Stats
      `/news/v1/player/${id}`, // Player News
    ];

    const [info, batting, bowling, career, news] = await Promise.all(
      endpoints.map((endpoint) =>
        apiClient.get(endpoint).catch((error) => {
          console.error(`Failed to fetch ${endpoint}`, error);
          return { data: null };
        })
      )
    );

    return {
      info: info.data,
      batting: batting.data,
      bowling: bowling.data,
      career: career.data,
      news: filterValidStories(news.data),
    };
  } catch (error) {
    return handleApiError("getPlayerInfo", error);
  }
};

// Fetch schedules
export const getSchedules = async () => {
  try {
    const response = await apiClient.get("/schedule/v1/league");
    return response.data;
  } catch (error) {
    return handleApiError("getSchedules", error);
  }
};

// Fetch series
export const getSeries = async () => {
  try {
    const response = await apiClient.get("/series/v1/league");
    return response.data;
  } catch (error) {
    return handleApiError("getSeries", error);
  }
};

// Fetch rankings
export const getRankings = async () => {
  try {
    const response = await apiClient.get("/stats/v1/rankings/batsment");
    return response.data;
  } catch (error) {
    return handleApiError("getRankings", error);
  }
};

// Get nav links
export const getNavLinks = async () => {
  try {
    // Fetch all data in parallel
    const [matches, schedulesData, seriesData, newsData] = await Promise.all([
      getLiveMatches(),
      getSchedules(),
      getSeries(),
      getNews(),
    ]);

    // Extract match names safely
    const matchNames =
      matches?.map((match) => match.matchInfo?.matchDesc || "Unknown Match") ||
      [];

    // Extract news headlines safely
    const newsHeadlines = newsData?.map((news) => news.story) || [];

    return {
      matches: matchNames,
      schedules: schedulesData || [],
      series: seriesData || [],
      news: newsHeadlines,
    };
  } catch (error) {
    return handleApiError("getNavLinks", error);
  }
};
