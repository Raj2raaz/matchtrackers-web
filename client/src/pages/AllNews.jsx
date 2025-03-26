import React, { useEffect, useState } from "react";
import useCricbuzzStore from "../store/cricket";
import { getNews } from "../api/Home";
import Image from "../components/Image";
import { useNavigate } from "react-router-dom";
import EditorPicks from "../components/EditorPicks";

export default function AllNews() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const news = await getNews();
      setNews(news);
    };

    fetchNews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl mb-12 font-bold tracking-tight text-gray-900">
        Latest Cricket News
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news && news.length > 0 ? (
          news.map((e, i) =>
            e.story ? (
              <div
                key={i}
                onClick={() => navigate("/news/" + e.story?.id)}
                className={`
                  group cursor-pointer transition-all duration-300 
                  ${i % 4 === 0 ? "md:col-span-2 md:row-span-2" : ""}
                  flex flex-col gap-4 
                  transform hover:-translate-y-2 hover:scale-[1.02]
                `}
              >
                <div className="aspect-video overflow-hidden rounded-xl">
                  <Image
                    faceImageId={e?.story?.imageId}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    resolution="de"
                  />
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {e?.story?.hline}
                  </h2>

                  <p className="text-gray-600 line-clamp-3">
                    {e?.story?.intro}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <span>{e?.story?.coverImage?.source || "Unknown"}</span>
                    <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                    <span>
                      {new Date(
                        Number(e?.story?.pubTime || Date.now())
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 italic">No news articles available</p>
          </div>
        )}
      </div>
      <EditorPicks />
    </div>
  );
}
