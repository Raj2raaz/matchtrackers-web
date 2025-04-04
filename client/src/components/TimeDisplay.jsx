import dayjs from "dayjs";
import Countdown from "react-countdown";

export default function TimeDisplay({ startTimestamp }) {
  const matchTime = dayjs(startTimestamp); // Assuming startTimestamp is in seconds
  const now = dayjs();

  const isToday = matchTime.isSame(now, "day");
  const isFuture = matchTime.isAfter(now);

  const timeText = matchTime.format("HH:mm");
  const dateText = isToday ? "Today" : matchTime.format("MMM D");

  return (
    <div className="text-center">
      <div className="text-lg font-bold">{timeText}</div>
      <div className="text-xs text-gray-500">{dateText}</div>
      <div className="text-sm text-black font-medium">
        {isFuture ? (
          <Countdown
            date={matchTime.toDate()}
            renderer={({ hours, minutes, seconds }) => (
              <span>
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </span>
            )}
          />
        ) : (
          "Started"
        )}
      </div>
    </div>
  );
}
