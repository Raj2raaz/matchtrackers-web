import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 80,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
      "/cricbuzz-img": {
        target: "https://cricbuzz-cricket.p.rapidapi.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cricbuzz-img/, ""),
      },
    },
  },
});
