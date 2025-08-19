import React from "react";
import { FaTrophy } from "react-icons/fa";
import useCricbuzzStore from "../store/cricket";
import Image from "./Image";
import { formatTimeAgo } from "../utils/util";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopNews({ length = 5 }) {
  const { news } = useCricbuzzStore();
  const navigate = useNavigate();
  return (
    <div>
      {/* Top News section */}
      <div className="border-t border bg-white dark:bg-gray-900 rounded-lg shadow-lg border-gray-200 dark:border-gray-700">
        <div className="p-4 flex flex-col gap-3">
          {news.slice(0, length).map((item, i) => (
            <div
              key={i}
              onClick={() => navigate("/cricket/news/" + item.story.id)}
              className="flex gap-3 pb-3 border-b cursor-pointer border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Image
                faceImageId={item.story?.imageId}
                className="w-[7rem] h-auto object-cover flex-shrink-0"
                resolution="gthumb"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 dark:text-gray-100 font-medium text-sm truncate">
                  {item.story.hline}
                </h3>
                <p className="text-xs mt-0.5 text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.story.intro}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {formatTimeAgo(Number(item.story.pubTime))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
