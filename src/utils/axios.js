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

export default apiClient;
