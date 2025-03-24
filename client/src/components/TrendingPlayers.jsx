import React from "react";
import useCricbuzzStore from "../store/mainStore";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import Image from "./Image";

export default function TrendingPlayers() {
  const { trendingPlayers } = useCricbuzzStore();
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white border p-4 border-[#e6e6e6]">
        <p className="text-xl font-bold mb-3">Trending Players</p>
        <div className="flex flex-wrap gap-3">
          {trendingPlayers?.player?.map((e, i) => (
            <div
              key={i}
              onClick={() => navigate("/player/" + e?.id)}
              className="pl-1 cursor-pointer hover:bg-gray-200 border-gray-300 border gap-4 pr-2 py-1 items-center justify-between rounded-full flex "
            >
              <div className="flex items-center gap-2">
                <Image
                  className="w-7 h-7 rounded-full"
                  faceImageId={e?.faceImageId}
                />
                <p className="text-sm font-medium text-primary">{e.name}</p>
              </div>
              <FaChevronRight size={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
