import React from "react";
import data from "../data.json";

export default function YtShorts() {
  return (
    <div className=" bg-white shadow-lg p-6 rounded-lg">
      <h1 className="text-xl font-semibold">Latest Match Videos</h1>
      <div className="p-4 no-scrollbar overflow-x-auto whitespace-nowrap flex gap-4">
        {data.youtube.map((e, i) => (
          <div key={i} className="w-[250px] h-[444px] flex-shrink-0">
            <iframe
              width="250"
              height="444"
              src={`https://www.youtube.com/embed/${e.split("/shorts/")[1]}`}
              title="YouTube Short"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}
