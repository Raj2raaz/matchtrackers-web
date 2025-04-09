import { create } from "zustand";

const useMainStore = create((set, get) => ({
  content: "cricket",
  setContent: (newContent) => set({ content: newContent }),

  refresh: false,
  refreshNow: () => set({ refresh: !get().refresh }),
}));

export default useMainStore;
