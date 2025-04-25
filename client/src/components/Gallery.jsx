import React from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCricbuzzStore from "../store/cricket";
import Image from "./Image";

export default function Gallery({ id = 0 }) {
  const navigate = useNavigate();
  const { galleries } = useCricbuzzStore();

  return (
    <div>
      <div className="p-4 bg-white border mt-6 shadow border-[#e6e6e6]">
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-bold text-primary">
            {galleries[0]?.headline} Photos
          </h1>
          <p
            onClick={() => navigate("/cricket/gallery")}
            className="flex cursor-pointer text-sm gap-2 items-center"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar whitespace-nowrap px-4">
          {galleries[id]?.images.map((e, i) => (
            <div key={i} className="shrink-0 w-[23vw]">
              <Image
                faceImageId={e}
                className="w-full h-full"
                resolution="gthumb"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
