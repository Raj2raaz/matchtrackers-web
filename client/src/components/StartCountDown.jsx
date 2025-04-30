import React, { useState, useEffect } from "react";

export default function MatchCountdown({ matchStartTimestamp }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchLive, setMatchLive] = useState(false);
  const [liveTime, setLiveTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const matchStartTime = parseInt(matchStartTimestamp);
      const timeDifference = matchStartTime - now;

      // Check if match has started
      if (timeDifference <= 0) {
        setMatchStarted(true);

        // Calculate time since match started (for live counter)
        const timeElapsed = Math.abs(timeDifference);
        const hoursLive = Math.floor(
          (timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesLive = Math.floor(
          (timeElapsed % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsLive = Math.floor((timeElapsed % (1000 * 60)) / 1000);

        setLiveTime({
          hours: hoursLive,
          minutes: minutesLive,
          seconds: secondsLive,
        });

        // Assume match is live for 8 hours max
        if (timeElapsed < 8 * 60 * 60 * 1000) {
          setMatchLive(true);
        } else {
          setMatchLive(false);
        }
      } else {
        // Calculate countdown to match start
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
        });
      }
    };

    // Initial calculation
    calculateTimeRemaining();

    // Set up interval for countdown
    const timerInterval = setInterval(calculateTimeRemaining, 1000);

    // Clean up interval
    return () => clearInterval(timerInterval);
  }, [matchStartTimestamp]);

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  if (matchStarted) {
    if (matchLive) {
      // Live match counter
      return <div></div>;
    } else {
      // Match has finished
      return <div className=""></div>;
    }
  } else {
    // Countdown to match start
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm  mb-1">Match starts in</div>
        <div className="flex justify-center gap-2 text-sm">
          {timeRemaining.days > 0 && (
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
                {timeRemaining.days}
              </div>
              <span className="text-xs ">days</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
              {formatNumber(timeRemaining.hours)}
            </div>
            <span className="text-xs ">hrs</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
              {formatNumber(timeRemaining.minutes)}
            </div>
            <span className="text-xs ">min</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded">
              {formatNumber(timeRemaining.seconds)}
            </div>
            <span className="text-xs ">sec</span>
          </div>
        </div>
      </div>
    );
  }
}
