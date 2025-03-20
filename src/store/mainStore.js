import { create } from "zustand";
import {
  getRecentMatches,
  getTrendingPlayers,
  getLiveMatches,
  getGalaryImages,
  getNews,
  getEditorPicks,
} from "../api/Home.js";

const useCricbuzzStore = create((set) => ({
  recentMatches: [],
  trendingPlayers: [],
  liveMatches: [],
  galleries: [],
  news: [],
  editorPicks: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });

    try {
      const [matches, players, live, imgs, news, editorPicks] =
        await Promise.all([
          getRecentMatches(),
          getTrendingPlayers(),
          getLiveMatches(),
          getGalaryImages(),
          getNews(),
          getEditorPicks(),
        ]);

      set({
        recentMatches: matches || [],
        trendingPlayers: players || [],
        liveMatches: live || [],
        news: news || [],
        galleries: imgs,
        editorPicks: editorPicks,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },
}));

export default useCricbuzzStore;
