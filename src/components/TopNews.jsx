import React from "react";
import { FaTrophy } from "react-icons/fa";
import useCricbuzzStore from "../store/mainStore";
import Image from "./Image";
import { formatTimeAgo } from "../utils/util";
import { Clock } from "lucide-react";

export default function TopNews() {
  const iplTable = [
    { position: 1, team: "RCB*", matches: 10, points: 30, nrr: "+2.225" },
    { position: 2, team: "GT*", matches: 10, points: 27, nrr: "+2.054" },
    { position: 3, team: "CSK", matches: 10, points: 24, nrr: "+1.345" },
  ];

  const { news } = useCricbuzzStore();

  return (
    <div>
      {/* Top News section */}
      <div className="border-t border bg-white rounded-lg shadow-lg border-gray-200">
        <div className="p-4 flex flex-col gap-3">
          <h2 className="text-lg font-bold">Top News</h2>

          {news.slice(0, 5).map((item, i) => (
            <div
              key={i}
              className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              <Image
                faceImageId={item.story?.imageId}
                className="w-[7rem] h-auto object-cover flex-shrink-0"
                resolution="gthumb"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-800 font-medium text-sm truncate">
                  {item.story.hline}
                </h3>
                <p className="text-xs mt-0.5 text-gray-600 line-clamp-2">
                  {item.story.intro}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
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
