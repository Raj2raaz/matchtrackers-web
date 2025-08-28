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
      <div
        className="
          grid grid-cols-2 gap-4
          md:flex md:space-x-6 md:overflow-x-auto md:pb-4 md:scrollbar-hide
        "
      >
        {links.map((link, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full md:w-72 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
          >
            <iframe
              className="w-full h-28 md:h-48"
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
