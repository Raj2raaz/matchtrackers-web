import React from "react";

export default function FanPredictions({
  predictions,
  selectedPrediction,
  handlePredictionClick,
}) {
  return (
    <div>
      <div className="flex-1 bg-gray-200 border rounded-xl border-slate-300 p-5">
        <h2 className="text-xl font-bold mb-1">Fan Predictions</h2>
        <p className="text-gray-700 mb-4">
          Cast your vote — who’s winning today?
        </p>
        {predictions.map((prediction, index) => (
          <div className="relative mb-4" key={index}>
            <div
              className="absolute top-0 left-0 h-full rounded-xl transition-all duration-500"
              style={{
                width:
                  selectedPrediction === index
                    ? `${prediction.percentage}%`
                    : "0%",
                backgroundColor:
                  index === 0
                    ? "rgba(34,197,94,0.4)" // green
                    : index === 1
                    ? "rgba(239,68,68,0.4)" // red
                    : index === 2
                    ? "rgba(59,130,246,0.4)" // blue
                    : "rgba(0,0,0,0.1)",
                zIndex: 20,
              }}
            ></div>

            <div
              className="relative border rounded-xl border-slate-300 py-4 z-10 text-center font-semibold cursor-pointer bg-white"
              onClick={() => handlePredictionClick(index)}
            >
              {prediction.team}{" "}
              <span className="ml-2 text-sm">{prediction.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
