import React from "react";

const YouTubeVideos = ({ links }) => {
  const getEmbedUrl = (url) => {
    let videoId = "";

    if (url.includes("youtube.com/watch")) {
      // Standard YouTube URL
      videoId = url.split("v=")[1];
      const ampersandPosition = videoId.indexOf("&");
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (url.includes("youtu.be/")) {
      // Shortened URL
      const path = url.split("youtu.be/")[1];
      const questionMarkPosition = path.indexOf("?");
      videoId =
        questionMarkPosition !== -1
          ? path.substring(0, questionMarkPosition)
          : path;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="py-6 px-4 md:px-8 bg-gray-200 dark:bg-gray-900 transition-colors duration-300 rounded-lg border my-3 shadow border-slate-300 dark:border-gray-700">
      {/* <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
    YouTube Videos
  </h2> */}

      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
        {links.map((link, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
          >
            <iframe
              className="w-full h-48"
              src={getEmbedUrl(link)}
              title={`YouTube video ${index}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeVideos;
