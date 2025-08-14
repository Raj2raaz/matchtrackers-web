import { useState, useEffect } from "react";
import axios from "axios";
import { cricApiClient as apiClient } from "../utils/axios";

const Image = ({ faceImageId, className = "", resolution = "" }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  if (!faceImageId) {
    setLoading(false);
    setError(true);
    return;
  }

  let isMounted = true;
  const controller = new AbortController();
  let timeoutId = null;

  const cleanup = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (imageSrc && typeof URL !== "undefined") URL.revokeObjectURL(imageSrc);
  };

  const fetchImage = async (retryAttempt = 0) => {
    // Set request timeout
    timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const url = `/img/v1/i1/c${faceImageId}/i.jpg${resolution ? `?p=${resolution}` : ""}`;
      const response = await apiClient.get(url, {
        responseType: "blob",
        signal: controller.signal,
        params: retryAttempt > 0 ? { _t: new Date().getTime() } : undefined,
      });

      clearTimeout(timeoutId);

      if (!isMounted) return;

      if (imageSrc) URL.revokeObjectURL(imageSrc);

      if (response.data && response.data.size > 0) {
        const contentType = response.headers["content-type"];
        if (contentType?.startsWith("image/")) {
          setImageSrc(URL.createObjectURL(response.data));
          setLoading(false);
          setError(false);
        } else throw new Error("Invalid content type");
      } else throw new Error("Empty response");
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === "AbortError" || axios.isCancel?.(err)) {
        // Do not log aborted requests
        if (retryAttempt < 3 && isMounted) {
          setTimeout(() => fetchImage(retryAttempt + 1), 1000 * Math.pow(2, retryAttempt));
        }
        return;
      }

      console.error(`Error fetching image (Attempt ${retryAttempt + 1}):`, err);

      if (retryAttempt < 3 && isMounted) {
        const delay = 1000 * Math.pow(2, retryAttempt);
        setTimeout(() => fetchImage(retryAttempt + 1), delay);
      } else if (isMounted) {
        setError(true);
        setLoading(false);
      }
    }
  };

  fetchImage(0);

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
