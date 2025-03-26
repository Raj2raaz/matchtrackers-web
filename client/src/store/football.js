import { create } from "zustand";
import { getLeagues } from "../api/Football";

const useFootballStore = create((set) => ({
  leagues: [],

  // Fetch all data at once
  fetchData: async () => {
    set({ loading: true, error: null });

    try {
      const [leagues] = await Promise.all([getLeagues()]);

      set({
        leagues: leagues,
      });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },

  // Generic function to fetch specific data dynamically
  fetchSpecificData: async (apiCall, stateKey) => {
    set({ loading: true, error: null });

    try {
      const data = await apiCall();
      set({ [stateKey]: data || [], loading: false });
    } catch (error) {
      set({ error: `Failed to fetch ${stateKey}`, loading: false });
    }
  },
}));

export default useFootballStore;
