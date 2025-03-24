import { create } from "zustand";
import {
  getRecentMatches,
  getTrendingPlayers,
  getLiveMatches,
  getGalaryImages,
  getNews,
  getEditorPicks,
  getSchedules,
  getNavLinks,
} from "../api/Home.js";

const useCricbuzzStore = create((set) => ({
  recentMatches: [],
  trendingPlayers: [],
  liveMatches: [],
  galleries: [],
  news: [],
  editorPicks: [],
  schedules: [],
  navLinks: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });

    try {
      const [
        matches,
        players,
        live,
        imgs,
        news,
        editorPicks,
        schedules,
        navLinks,
      ] = await Promise.all([
        getRecentMatches(),
        getTrendingPlayers(),
        getLiveMatches(),
        getGalaryImages(),
        getNews(),
        getEditorPicks(),
        getSchedules(),
        getNavLinks(),
      ]);

      set({
        recentMatches: matches || [],
        trendingPlayers: players || [],
        liveMatches: live || [],
        news: news || [],
        galleries: imgs,
        schedules: schedules,
        editorPicks: editorPicks,
        navLinks: navLinks,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },
}));

export default useCricbuzzStore;
