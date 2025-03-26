import { create } from "zustand";

const useMainStore = create((set) => ({
  content: "cricket",
  setContent: (newContent) => set({ content: newContent }),
}));

export default useMainStore;
