import React, { useEffect, useState } from "react";
import Image from "../components/Image";
import { getGalaryImages } from "../api/Home";
import { Helmet } from "react-helmet-async";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGalaryImages();
        setGallery(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center ">
        <div className="animate-pulse text-white text-2xl">
          Loading gallery...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-100">
        <div className="text-red-600 text-2xl text-center">
          Failed to load gallery
          <p className="text-base mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <Helmet>
        <title>Match Trackers | Live Scores, Stats & News</title>
        <meta
          name="description"
          content="Track live matches, player stats, rankings, and news across all formats and leagues at Match Trackers."
        />

        {/* Open Graph (Facebook, WhatsApp, etc.) */}
        <meta
          property="og:title"
          content="Match Trackers | Live Scores, Stats & News"
        />
        <meta
          property="og:description"
          content="Track live matches, player stats, rankings, and news across all formats and leagues."
        />
        <meta
          property="og:image"
          content="https://matchtrackers.com/favicon.svg"
        />
        <meta property="og:url" content="https://matchtrackers.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Match Trackers | Live Scores, Stats & News"
        />
        <meta
          name="twitter:description"
          content="Get updated with the latest scores, rankings and sports news."
        />
        <meta
          name="twitter:image"
          content="https://matchtrackers.com/favicon.svg"
        />
      </Helmet>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-tight ">
          Cricket Moments Gallery
        </h1>

        <div className="space-y-8">
          {gallery.slice(0, 5).map((item) => (
            <div
              key={item.galleryId}
              className=" rounded-xl shadow-md overflow-hidden transition-transform duration-300"
            >
              <div className="px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.headline}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                {item.images.map((imageId) => (
                  <div key={imageId} className="rounded-lg overflow-hidden">
                    <Image
                      faceImageId={imageId}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      resolution="de"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
