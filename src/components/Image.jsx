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
    const fetchImage = async () => {
      if (!faceImageId) return;

      try {
        const response = await apiClient.get(
          `/img/v1/i1/c${faceImageId}/i.jpg${resolution && `?p=${resolution}`}`,
          {
            responseType: "blob", // Fetch image as a Blob
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [faceImageId]);

  if (loading) return <p>Loading image...</p>;
  if (error) return <p>Error loading image</p>;

  return (
    <img
      src={imageSrc || "default-avatar.jpg"} // Fallback image
      alt="Player"
      className={`object-cover ${className}`} // Apply dynamic className
    />
  );
};

export default Image;
