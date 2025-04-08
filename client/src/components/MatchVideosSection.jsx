import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import Hls from "hls.js";
import Image from "./Image";

const MatchVideosSection = ({ commentary }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const videosPerPage = 4;
  const totalPages = Math.ceil(commentary?.matchVideos?.length / videosPerPage);

  useEffect(() => {
    if (selectedVideo && selectedVideo.videoUrl && videoRef.current) {
      const videoElement = videoRef.current;
      if (selectedVideo.videoUrl.includes(".m3u8")) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(selectedVideo.videoUrl);
          hls.attachMedia(videoElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play();
          });
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = selectedVideo.videoUrl;
          videoElement.addEventListener("loadedmetadata", () => {
            videoElement.play();
          });
        }
      } else {
        videoElement.src = selectedVideo.videoUrl;
      }
    }
  }, [selectedVideo]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const openVideoInNewTab = (video) => {
    window.open(video.videoUrl, "_blank");
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Match Videos</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Watch the latest analysis, highlights and interviews
      </p>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative bg-black w-full max-w-4xl rounded-lg overflow-hidden">
            <button
              onClick={closeVideo}
              className="absolute right-2 top-2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <FaTimes />
            </button>
            <div className="aspect-video w-full">
              {selectedVideo.videoUrl.includes(".m3u8") ? (
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                ></video>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-900">
                  <p className="text-white mb-4">
                    The video cannot be played in the embedded player.
                  </p>
                  <button
                    onClick={() => openVideoInNewTab(selectedVideo)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
                  >
                    Open video in new tab <FaExternalLinkAlt className="ml-2" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 bg-black text-white">
              <h3 className="font-bold text-lg mb-2">
                {selectedVideo.headline}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags &&
                  selectedVideo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-800 text-gray-200 px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {commentary?.matchVideos?.length > 0 ? (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto scroll-smooth no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {commentary?.matchVideos?.map((video, index) => (
              <div
                key={index}
                className="min-w-[250px] cursor-pointer"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="mb-2 relative overflow-hidden rounded">
                  <Image
                    faceImageId={video.imageId}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    resolution="de"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-40 rounded-full p-2 group-hover:bg-blue-600 transition-colors">
                      <FaPlay className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{video.videoType}</span>
                  <span>
                    {new Date(
                      parseInt(video.commTimestamp)
                    ).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1 line-clamp-2">
                  {video.headline}
                </h3>
                {video.tags && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {video.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <button className="text-xs flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  Watch now <FaChevronRight className="ml-1 text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No Match Videos for this match</p>
      )}

      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollPrev}
        >
          <FaChevronLeft className="text-gray-500 text-xs" />
        </button>
        <button
          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={scrollNext}
        >
          <FaChevronRight className="text-gray-500 text-xs" />
        </button>
      </div>
    </div>
  );
};

export default MatchVideosSection;
