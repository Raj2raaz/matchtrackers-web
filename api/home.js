import axios from "axios";

const API_HOST = import.meta.env.VITE_CRICBUZZ_API_HOST;
const API_KEY = import.meta.env.VITE_CRICBUZZ_API_KEY;

const apiClient = axios.create({
  baseURL: `https://${API_HOST}`,
  headers: {
    "x-rapidapi-host": API_HOST,
    "x-rapidapi-key": API_KEY,
  },
});

// Fetch recent matches
export const getRecentMatches = async () => {
  try {
    const response = await apiClient.get("/matches/v1/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    return null;
  }
};

// Fetch trending players (assuming endpoint exists)
export const getTrendingPlayers = async () => {
  try {
    const response = await apiClient.get("/players/v1/trending");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending players:", error);
    return null;
  }
};

// Fetch featured videos (assuming endpoint exists)
export const getFeaturedVideos = async () => {
  try {
    const response = await apiClient.get("/videos/v1/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured videos:", error);
    return null;
  }
};
