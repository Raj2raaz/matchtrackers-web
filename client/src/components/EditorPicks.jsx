import React from "react";
import { useNavigate } from "react-router-dom";
import useCricbuzzStore from "../store/cricket";
import { FaChevronRight } from "react-icons/fa";
import Image from "./Image";

export default function EditorPicks() {
  const navigate = useNavigate();
  const { editorPicks } = useCricbuzzStore((state) => state.editorPicks);

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 mt-5 border rounded-lg p-4 border-[#e6e6e6] dark:border-gray-700">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-lg md:text-xl font-bold text-primary dark:text-blue-400">
            Editors Picks
          </h1>
          <p
            onClick={() => navigate("/cricket/all-news")}
            className="flex text-xs md:text-sm gap-1 md:gap-2 items-center cursor-pointer text-gray-700 dark:text-gray-300 hover:underline"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 no-scrollbar">
            {editorPicks?.slice(0, 6).map((e, i) => (
              <div
                key={i}
                className="bg-black dark:bg-gray-800 flex-shrink-0 w-full sm:w-[calc(100%/2.2)] md:w-[calc(100%/2.5)] lg:w-[calc(100%/3.5)] text-white rounded-lg md:rounded-2xl snap-start cursor-pointer transition-colors hover:brightness-110"
                onClick={() => navigate(`/cricket/news/${e?.story?.id}`)}
              >
                <Image
                  faceImageId={e?.story?.imageId}
                  resolution="gthumb"
                  className="w-full h-40 sm:h-44 md:h-48 lg:h-[15rem] rounded-t-lg md:rounded-t-2xl object-cover"
                />
                <div className="p-3 md:p-4">
                  <h1 className="text-base md:text-lg font-semibold line-clamp-2">
                    {e?.story?.hline}
                  </h1>
                  <p className="line-clamp-2 md:line-clamp-3 text-xs md:text-sm mt-1 text-gray-200 dark:text-gray-300">
                    {e?.story?.intro}
                  </p>
                  <p className="text-gray-200 dark:text-gray-400 text-xs mt-2">
                    Source: {e?.story.coverImage?.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
