import React, { useEffect, useState } from "react";
import apiClient from "../utils/axios";
import { useParams } from "react-router-dom";
import Image from "../components/Image";
import TopNews from "../components/TopNews";

const NewsPage = ({}) => {
  const [newsData, setNewData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(
        "/news/v1/detail/" + (id || "122025")
      );
      setNewData(response.data);
    };
    fetchData();
  }, [id]);

  if (!newsData) {
    return <div className="p-4">Loading...</div>;
  }

  const {
    headline,
    publishTime,
    content,
    authors,
    tags,
    seoTitle,
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
      second: "numeric",
    });
  };

  return (
    <div className="flex gap-10">
      <div className=" w-3/2 p-4">
        <h1 className="text-3xl font-bold mb-4">{headline}</h1>
        <p className="text-sm text-gray-600 mb-2">
          {formatDate(publishTime)} | Source: {source}
        </p>
        {coverImage && coverImage.source && (
          <div className="mb-4">
            <Image
              faceImageId={coverImage.id}
              className="h-full w-full"
              resolution="de"
            />
            <p className="text-xs text-gray-500 mt-1">{coverImage.caption}</p>
          </div>
        )}
        {intro && <p className="italic mb-4">{intro}</p>}
        {content &&
          content.map((item, index) => {
            if (item.content && item.content.contentValue) {
              return (
                <p key={index} className="mb-4">
                  {item.content.contentValue}
                </p>
              );
            }
            return null;
          })}
        {tags && tags.length > 0 && (
          <div className="mt-6">
            <strong className="block mb-2">Tags:</strong>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag.itemName}
                </span>
              ))}
            </div>
          </div>
        )}
        {authors && authors.length > 0 && (
          <div className="mt-4">
            <strong className="block mb-2">Authors:</strong>
            <div className="flex flex-wrap gap-2">
              {authors.map((author, index) => (
                <span key={index} className="text-sm">
                  {author.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <a
          href={webURL}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-6 text-blue-600 hover:underline"
        >
          Read more on Cricbuzz.com
        </a>
      </div>
      <div className="w-1/2">
        <TopNews />
      </div>
    </div>
  );
};

export default NewsPage;
