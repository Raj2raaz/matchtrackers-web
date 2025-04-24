import React, { useEffect, useState } from "react";
import useCricbuzzStore from "../store/cricket";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import Image from "./Image";
import useMainStore from "../store/MainStore";
import { getPlayers } from "../api/Football";

export default function TrendingPlayers() {
  const { trendingPlayers } = useCricbuzzStore();
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
      <div className="bg-white rounded-lg border p-4 border-[#e6e6e6]">
        <p className="text-xl font-bold mb-3">Trending Players</p>
        <div className="flex flex-wrap gap-3">
          {content === "cricket"
            ? trendingPlayers?.player?.map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/cricket/player/" + e?.id)}
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
              ))
            : fbPlayers.map((e, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/cricket/player/" + e?.player?.id)}
                  className="pl-1 cursor-pointer hover:bg-gray-200 border-gray-300 border gap-4 pr-2 py-1 items-center justify-between rounded-full flex "
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={e.player.photo}
                      className="h-7 w-7 rounded-full"
                      alt=""
                    />
                    <p className="text-sm font-medium text-primary">
                      {e.player.name}
                    </p>
                  </div>
                  <FaChevronRight size={10} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
