import React from "react";
import { useNavigate } from "react-router-dom";
import useCricbuzzStore from "../store/mainStore";
import { FaChevronRight } from "react-icons/fa";
import Image from "./Image";

export default function EditorPicks() {
  const navigate = useNavigate();
  const { editorPicks } = useCricbuzzStore();
  return (
    <div>
      <div className="bg-white mt-5 border p-4 border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">Editors Picks</h1>
          <p className="flex text-sm gap-2 items-center">
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 no-scrollbar">
            {editorPicks.slice(0, 6).map((e, i) => (
              <div
                key={i}
                className="bg-black flex-shrink-0 w-[calc(100%/3.5)] text-white rounded-2xl snap-start"
              >
                <Image
                  faceImageId={e?.story?.imageId}
                  resolution="gthumb"
                  className="w-full h-[15rem] rounded-2xl"
                />
                <div className="p-4">
                  <h1 className="text-lg font-semibold">{e?.story?.hline}</h1>
                  <p className="line-clamp-3 text-sm">{e?.story?.intro}</p>
                  <p className="text-gray-200">
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
