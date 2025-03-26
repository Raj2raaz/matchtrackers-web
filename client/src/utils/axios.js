import axios from "axios";

const CRIC_API_HOST = import.meta.env.VITE_CRICBUZZ_API_HOST;
const FOOTBALL_API_HOST = import.meta.env.VITE_FOOTBALL_API_HOST;
const API_KEY = import.meta.env.VITE_CRICBUZZ_API_KEY;
const FOOTBALL_API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

const cricApiClient = axios.create({
  baseURL: `https://${CRIC_API_HOST}`,
  headers: {
    "x-rapidapi-host": CRIC_API_HOST,
    "x-rapidapi-key": API_KEY,
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, x-rapidapi-host, x-rapidapi-key",
  },
});

const footballApiClient = axios.create({
  baseURL: `https://${FOOTBALL_API_HOST}`,
  headers: {
    "x-rapidapi-host": FOOTBALL_API_HOST,
    "x-rapidapi-key": API_KEY,
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, x-rapidapi-host, x-rapidapi-key",
  },
});

// Interceptor to handle potential CORS or network errors
cricApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded. Waiting before retrying...");
      // Implement exponential backoff or retry mechanism
      return new Promise((resolve) =>
        setTimeout(() => resolve(cricApiClient(error.config)), 1000)
      );
    }
    return Promise.reject(error);
  }
);

footballApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded. Waiting before retrying...");
      // Implement exponential backoff or retry mechanism
      return new Promise((resolve) =>
        setTimeout(() => resolve(footballApiClient(error.config)), 1000)
      );
    }
    return Promise.reject(error);
  }
);

export { cricApiClient, footballApiClient };
