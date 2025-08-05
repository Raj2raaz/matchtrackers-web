import React from "react";

export default function FanPredictions({
  predictions,
  selectedPrediction,
  handlePredictionClick,
}) {
  return (
    <div>
      {/* Enhanced CSS Animations */}
      <style>
        {`
          /* WAVE ANIMATION */
          .wave-bar::before {
            content: "";
            position: absolute;
            top: 100%;
            left: 0;
            width: 200%;
            height: 200%;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z' fill='%23ffffff'/%3E%3C/svg%3E") repeat-x;
            background-size: 50% 100%;
            animation: wave 4s linear infinite;
            opacity: 0.3;
            transform: translateY(-50%);
          }

          @keyframes wave {
            0% {
              transform: translateX(0) translateY(-50%);
            }
            100% {
              transform: translateX(-50%) translateY(-50%);
            }
          }

          /* SHIMMER EFFECT */
          .shimmer::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
            z-index: 30;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          /* BUBBLES */
          .bubble-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 25;
            pointer-events: none;
          }

          .bubble {
            position: absolute;
            bottom: -10px;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: rise 4s infinite ease-in;
            opacity: 0.6;
          }

          @keyframes rise {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.6;
            }
            100% {
              transform: translateY(-120px) scale(1.2);
              opacity: 0;
            }
          }

          /* GLOW ON SELECTION */
          .selected-glow {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            animation: pulse-glow 1.5s infinite;
          }

          @keyframes pulse-glow {
            0% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
            }
            100% {
              box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
            }
          }

          /* COLORS */
          .wave-green {
            background-color: rgba(34, 197, 94, 0.4);
          }
          .wave-red {
            background-color: rgba(239, 68, 68, 0.4);
          }
          .wave-blue {
            background-color: rgba(59, 130, 246, 0.4);
          }
          .wave-default {
            background-color: rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <div className="flex-1 bg-gray-200 border rounded-xl border-slate-300 p-5">
        <h2 className="text-xl font-bold mb-1">Fan Predictions</h2>
        <p className="text-gray-700 mb-4">
          Cast your vote — who’s winning today?
        </p>

        {predictions.map((prediction, index) => {
          const isSelected = selectedPrediction === index;
          const waveColor =
            index === 0
              ? "wave-green"
              : index === 1
              ? "wave-red"
              : index === 2
              ? "wave-blue"
              : "wave-default";

          return (
            <div className="relative mb-4" key={index}>
              {/* Animated fill bar with shimmer and wave */}
              <div
                className={`absolute top-0 left-0 h-full rounded-xl overflow-hidden z-20 wave-bar shimmer ${
                  isSelected ? "selected-glow" : ""
                } ${waveColor}`}
                style={{
                  width: isSelected
                    ? `${prediction.percentage}%`
                    : "0%",
                  transition: "width 1s ease-out",
                }}
              >
                {/* Bubbles */}
                <div className="bubble-container">
                  <div className="bubble" style={{ left: "20%" }}></div>
                  <div className="bubble" style={{ left: "50%" }}></div>
                  <div className="bubble" style={{ left: "75%" }}></div>
                </div>
              </div>

              {/* Clickable top layer */}
              <div
                className={`relative border rounded-xl border-slate-300 py-4 z-10 text-center font-semibold cursor-pointer bg-white transition-all duration-300`}
                onClick={() => handlePredictionClick(index)}
              >
                {prediction.team}{" "}
                <span className="ml-2 text-sm">{prediction.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
