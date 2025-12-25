import React, { useEffect, useState } from "react";
import useCricbuzzStore from "../store/cricket";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import Image from "./Image";
import useMainStore from "../store/MainStore";
import { getPlayers } from "../api/Football";

export default function TrendingPlayers() {
  const { trendingPlayers } = useCricbuzzStore((state) => state.trendingPlayers);
  const navigate = useNavigate();
  const { content } = useMainStore();
  const [fbPlayers, setFbPlayers] = useState([]);

  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await getPlayers();
  //     setFbPlayers(data);
  //   };

  //   getData();
  // }, [content]);

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 border-[#e6e6e6] dark:border-gray-700">
        <p className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          Trending Players
        </p>
        <div className="flex flex-wrap gap-3">
          {content === "cricket"
            ? trendingPlayers?.player?.map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/cricket/player/" + e?.id)}
                  className="pl-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 border gap-4 pr-2 py-1 items-center justify-between rounded-full flex transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      className="w-7 h-7 rounded-full"
                      faceImageId={e?.faceImageId}
                    />
                    <p className="text-sm font-medium text-primary dark:text-blue-400">
                      {e.name}
                    </p>
                  </div>
                  <FaChevronRight
                    size={10}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </div>
              ))
            : fbPlayers.map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/cricket/player/" + e?.player?.id)}
                  className="pl-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700 border gap-4 pr-2 py-1 items-center justify-between rounded-full flex transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={e.player.photo}
                      className="h-7 w-7 rounded-full"
                      alt=""
                    />
                    <p className="text-sm font-medium text-primary dark:text-blue-400">
                      {e.player.name}
                    </p>
                  </div>
                  <FaChevronRight
                    size={10}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
