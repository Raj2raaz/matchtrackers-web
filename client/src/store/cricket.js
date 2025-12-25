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

let hasFetchedOnce = false;
let fetchPromise = null;

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

    console.log("🔥 fetchData CALLED");
    // 🔒 HARD STOP duplicate calls
    if (hasFetchedOnce) return fetchPromise;

    if (fetchPromise) return fetchPromise;

    set({ loading: true, error: null });

    fetchPromise = (async () => {
      try {
        const [
          matches,
          players,
          live,
          imgs,
          news,
          editorPicks,
          schedules,
          // navLinks,
        ] = await Promise.all([
          getRecentMatches(),
          getTrendingPlayers(),
          getLiveMatches(),
          getGalaryImages(),
          getNews(),
          getEditorPicks(),
          getSchedules(),
          // getNavLinks(),
        ]);

        set({
          recentMatches: matches || [],
          trendingPlayers: players || [],
          liveMatches: live || [],
          galleries: imgs || [],
          news: news || [],
          editorPicks: editorPicks || [],
          schedules: schedules || [],
          // navLinks: navLinks || [],
          loading: false,
        });

        hasFetchedOnce = true;
      } catch (error) {
        set({ error: "Failed to fetch data", loading: false });
      }
    })();

    return fetchPromise;
  },
}));

export default useCricbuzzStore;
