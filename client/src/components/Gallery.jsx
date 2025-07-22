import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useCricbuzzStore from "../store/cricket";
import Image from "./Image";
import { getGalaryImages } from "../api/Home";

export default function Gallery({ id = 0 }) {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await getGalaryImages();
        setGalleries(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <div>
      <div className="p-4 rounded-lg bg-gray-200 border my-3 shadow border-slate-300">
        <div className="flex md:flex flex-col justify-between w-full">
          <h1 className="text-xl font-bold text-primary">
            {galleries[0]?.headline || ""} Photos
          </h1>
          <p
            onClick={() => navigate("/cricket/gallery")}
            className="flex cursor-pointer text-sm gap-2 items-center"
          >
            See All <FaChevronRight size={12} />
          </p>
        </div>
        <div className="flex gap-4 mt-3 overflow-x-auto no-scrollbar whitespace-nowrap ">
          {galleries[id]?.images.map((e, i) => (
            <div key={i} className="shrink-0 min-w-54 max-w-[23vw]">
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
