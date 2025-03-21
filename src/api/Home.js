import apiClient from "../utils/axios";

// Fetch recent matches
export const getRecentMatches = async () => {
  try {
    const response = await apiClient.get("/matches/v1/recent");
    const priority = ["League", "International", "Domestic", "Women"];

    const sorted = priority.flatMap((type) =>
      response.data.typeMatches
        .filter((e) => e.matchType === type)
        .flatMap((e) => e.seriesMatches)
    );

    return sorted;
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    return null;
  }
};

export const getLiveMatches = async () => {
  try {
    const matches = await getRecentMatches();

    // Filter matches where India is playing
    const sorted = matches.flatMap((e) => {
      if (!e.seriesAdWrapper) return [];

      return e.seriesAdWrapper.matches.filter((f) => {
        const team1 = f.matchInfo?.team1?.teamName?.toLowerCase() || "";
        const team2 = f.matchInfo?.team2?.teamName?.toLowerCase() || "";

        return team1.includes("india") || team2.includes("india");
      });
    });

    // Prioritize live matches first, then others
    const finalSorted = [
      ...sorted.filter((match) => match.matchInfo?.state === "Live"),
      ...sorted.filter((match) => match.matchInfo?.state !== "Live"),
    ].slice(0, 5); // Ensure we only get top 5 matches

    // Fetch commentary for each match
    const matchesWithCommentary = await Promise.all(
      finalSorted.map(async (match) => {
        try {
          const response = await apiClient.get(
            `/mcenter/v1/${match.matchInfo.matchId}/comm`
          );

          return {
            ...match,
            commentary: response.data.commentaryList,

            // Add commentary to match data
          };
        } catch (error) {
          console.error(
            `Error fetching commentary for match ${match.matchInfo.matchId}:`,
            error
          );
          return { ...match, commentary: null }; // Add null if fetching fails
        }
      })
    );

    return matchesWithCommentary;
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return null;
  }
};

// Fetch trending players (assuming endpoint exists)
export const getTrendingPlayers = async () => {
  try {
    const response = await apiClient.get("/stats/v1/player/trending");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending players:", error);
    return null;
  }
};

// fetch galary
export const getGalaryImages = async () => {
  try {
    const response = await apiClient.get("/photos/v1/index");

    const imgs = response.data.photoGalleryInfoList
      .slice(0, 2)
      .map((gallery) => ({
        headline: gallery.photoGalleryInfo.headline,
        galleryId: gallery.photoGalleryInfo.galleryId,
        images: [],
      }));

    // Fetch images for each gallery
    await Promise.all(
      imgs.map(async (gallery) => {
        try {
          const galleryResponse = await apiClient.get(
            `/photos/v1/detail/${gallery.galleryId}`
          );

          gallery.images = galleryResponse.data.photoGalleryDetails.map(
            (img) => img.imageId
          );
        } catch (error) {
          console.error(
            `Error fetching images for gallery ${gallery.galleryId}`,
            error
          );
        }
      })
    );

    return imgs;
  } catch (error) {
    console.error("error fetching galary images:", error);
  }
};

export const getNews = async () => {
  try {
    const news = await apiClient.get("/news/v1/index");
    return news.data.storyList.filter((e) => e.story);
  } catch (error) {
    console.error("Error Fetching news:", error);
  }
};

export const getEditorPicks = async () => {
  try {
    const news = await apiClient.get("/news/v1/cat/2");
    return news.data.storyList.filter((e) => e.story);
  } catch (error) {
    console.error("Error Fetching News:", error);
  }
};

export const getPlayerInfo = async (id) => {
  try {
    const endpoints = [
      `/stats/v1/player/${id}`, // Player Info
      `/stats/v1/player/${id}/batting`, // Batting Stats
      `/stats/v1/player/${id}/bowling`, // Bowling Stats
      `/stats/v1/player/${id}/career`, // Career Stats
      `/news/v1/player/${id}`,
    ];

    const [info, batting, bowling, career, news] = await Promise.all(
      endpoints.map((endpoint) => apiClient.get(endpoint))
    );

    return {
      info: info.data,
      batting: batting.data,
      bowling: bowling.data,
      career: career.data,
      news: news?.data?.storyList?.filter((e) => e.story),
    };
  } catch (error) {
    console.error("Error Fetching Player Data", error);
    return null; // Return null in case of an error
  }
};

export const getSchedules = async () => {
  try {
    const response = await apiClient.get("/schedule/v1/league");
    return response.data;
  } catch (error) {
    console.error("Error Fetching Schedules:", error);
  }
};

export const getNavLinks = async () => {
  try {
    // Get live matches (India priority)
    const matches = await getLiveMatches();
    const matchNames = matches.map(
      (match) => match.matchInfo?.matchDesc || "Unknown Match"
    );

    // Get league schedules
    const schedulesData = await getSchedules();
    const schedules = schedulesData;

    // Get teams (IPL Priority)
    const teams = schedules; // Since league schedules and teams overlap

    // Get news headlines
    const newsData = await getNews();
    const newsHeadlines = newsData.map((news) => news.story);
    // console.log(matchNames, schedules, teams, newsHeadlines);

    return {
      matches: matchNames,
      schedules,
      teams,
      news: newsHeadlines,
    };
  } catch (error) {
    console.error("Error fetching names:", error);
    return null;
  }
};
