import React, { useEffect, useState } from "react";
import { cricApiClient as apiClient } from "../utils/axios";
import { useParams } from "react-router-dom";
import Image from "../components/Image";
import TopNews from "../components/TopNews";
import { Helmet } from "react-helmet-async";

const NewsPage = () => {
  const [newsData, setNewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/news/v1/detail/${id || "122025"}`
        );
        setNewsData(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg font-medium text-gray-600">Loading news...</div>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg font-medium text-gray-600">News not found</div>
      </div>
    );
  }

  const {
    headline,
    publishTime,
    content,
    authors,
    tags,
    webURL,
    intro,
    source,
    coverImage,
  } = newsData;

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Helmet>
        <title>Match Trackers | Live Scores, Stats & News</title>
        <meta
          name="description"
          content="Track live matches, player stats, rankings, and news across all formats and leagues at Match Trackers."
        />

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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Main content area */}
        <div className="w-full lg:w-2/3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
            {headline}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {formatDate(publishTime)} | Source: {source}
          </p>

          {coverImage && coverImage.source && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-sm">
              <Image
                faceImageId={coverImage.id}
                className="w-full h-auto object-cover"
                resolution="de"
              />
              {coverImage.caption && (
                <p className="text-xs text-gray-500 mt-2 px-1">
                  {coverImage.caption}
                </p>
              )}
            </div>
          )}

          {intro && (
            <p className="italic mb-6 text-gray-700 text-lg leading-relaxed">
              {intro}
            </p>
          )}

          <div className="prose max-w-none">
            {content &&
              content.map((item, index) => {
                if (item.content && item.content.contentValue) {
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {item.content.contentValue}
                    </p>
                  );
                }
                return null;
              })}
          </div>

          <div className="mt-8 space-y-4">
            {tags && tags.length > 0 && (
              <div>
                <strong className="text-gray-800 block mb-2">Topics</strong>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-full text-sm"
                    >
                      {tag.itemName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {authors && authors.length > 0 && (
              <div>
                <strong className="text-gray-800 block mb-2">By</strong>
                <div className="flex flex-wrap gap-2">
                  {authors.map((author, index) => (
                    <span key={index} className="text-sm text-gray-700">
                      {author.name}
                      {index < authors.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">More News</h2>
            <TopNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
