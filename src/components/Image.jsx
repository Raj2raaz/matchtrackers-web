import { useState, useEffect } from "react";
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

const Image = ({ faceImageId, className = "", resolution = "" }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Early return if no image ID provided
    if (!faceImageId) {
      setLoading(false);
      setError(true);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    let timeoutId = null;

    // Function to safely clean up resources
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (imageSrc && typeof URL !== "undefined") URL.revokeObjectURL(imageSrc);
    };

    const fetchImage = async (retryAttempt = 0) => {
      // Clean up any previous timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Set a timeout for this request
      timeoutId = setTimeout(() => {
        controller.abort();
        if (isMounted && retryAttempt < 3) {
          console.log(`Request timed out (attempt ${retryAttempt + 1})`);
          // Retry with exponential backoff
          fetchImage(retryAttempt + 1);
        } else if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }, 10000); // 10 second timeout

      try {
        const url = `/img/v1/i1/c${faceImageId}/i.jpg${
          resolution ? `?p=${resolution}` : ""
        }`;
        console.log(`Fetching image: ${url} (attempt ${retryAttempt + 1})`);

        const response = await apiClient.get(url, {
          responseType: "blob",
          signal: controller.signal,
          // Add cache busting parameter if this is a retry
          params: retryAttempt > 0 ? { _t: new Date().getTime() } : undefined,
        });

        // Clear timeout since request completed
        clearTimeout(timeoutId);

        if (isMounted) {
          // Clean up existing blob URL before creating a new one
          if (imageSrc && typeof URL !== "undefined")
            URL.revokeObjectURL(imageSrc);

          // Make sure we have valid image data
          if (response.data && response.data.size > 0) {
            // Verify content type is an image
            const contentType = response.headers["content-type"];
            if (contentType && contentType.startsWith("image/")) {
              const imageUrl = URL.createObjectURL(response.data);
              setImageSrc(imageUrl);
              setLoading(false);
              setError(false);
            } else {
              console.error("Invalid content type received:", contentType);
              throw new Error("Invalid content type");
            }
          } else {
            console.error("Empty response or invalid blob received");
            throw new Error("Empty response");
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);

        if (err.name === "AbortError") {
          console.log("Request was aborted");
          return; // Already handled by timeout logic
        }

        console.error(
          `Error fetching image (Attempt ${retryAttempt + 1}):`,
          err
        );

        if (isMounted && retryAttempt < 3) {
          // Retry with exponential backoff
          const delay = 1000 * Math.pow(2, retryAttempt);
          console.log(`Retrying in ${delay}ms...`);
          setTimeout(() => fetchImage(retryAttempt + 1), delay);
        } else if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    // Start the initial fetch
    fetchImage(0);

    // Clean up on unmount or when dependencies change
    return () => {
      isMounted = false;
      controller.abort();
      cleanup();
    };
  }, [faceImageId, resolution]);

  // Image onLoad handler to verify image loaded correctly
  const handleImageLoad = (e) => {
    // Check if the image has actual dimensions
    if (e.target.naturalWidth === 0 || e.target.naturalHeight === 0) {
      console.error("Image loaded with zero dimensions");
      setError(true);
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <svg
            className="w-8 h-8 text-gray-400 animate-spin"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  // Display error state
  if (error || !imageSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
      >
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
    );
  }

  // Display the image
  return (
    <img
      src={imageSrc}
      alt="Player"
      className={`object-cover ${className}`}
      onLoad={handleImageLoad}
      onError={() => {
        console.error("Image failed to load");
        setError(true);
        if (imageSrc) URL.revokeObjectURL(imageSrc);
      }}
    />
  );
};

export default Image;
