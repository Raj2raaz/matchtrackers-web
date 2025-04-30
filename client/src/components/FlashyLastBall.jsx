import React, { useMemo } from "react";

export default function LastBallResult({ recentOvsStats }) {
  // Extract the last ball result from the recent overs stats
  const lastBall = useMemo(() => {
    if (!recentOvsStats) return null;

    // Split by pipe and get the last segment
    const segments = recentOvsStats.split("|");
    if (segments.length <= 1) return null;

    // Get the last segment and trim it
    const lastSegment = segments[segments.length - 1].trim();

    // Split the segment by spaces and get the last ball
    const balls = lastSegment.trim().split(" ");
    return balls[balls.length - 1];
  }, [recentOvsStats]);

  // If no last ball found
  if (!lastBall) {
    return null;
  }

  // Function to get ball styling
  const getBallStyle = () => {
    // Default style
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-700";
    let borderColor = "border-gray-200";
    let label = lastBall;

    // Apply specific styles based on ball result
    if (lastBall === "4") {
      bgColor = "bg-green-500";
      textColor = "text-white";
      borderColor = "border-green-600";
      label = "FOUR";
    } else if (lastBall === "6") {
      bgColor = "bg-blue-500";
      textColor = "text-white";
      borderColor = "border-blue-600";
      label = "SIX";
    } else if (lastBall === "W") {
      bgColor = "bg-red-500";
      textColor = "text-white";
      borderColor = "border-red-600";
      label = "WICKET";
    } else if (lastBall === "Wd") {
      label = "WIDE";
    } else if (lastBall === "Nb") {
      label = "NO BALL";
    } else if (["Lb", "B", "L1", "L2", "L3", "L4"].includes(lastBall)) {
      label = lastBall === "B" ? "BYE" : "LEG BYE";
    }

    return { bgColor, textColor, borderColor, label };
  };

  const { bgColor, textColor, borderColor, label } = getBallStyle();

  return (
    <div className="inline-flex items-center">
      <div
        className={`px-3 py-1 rounded-md font-bold ${bgColor} ${textColor} border ${borderColor}`}
      >
        {label}
      </div>
    </div>
  );
}
