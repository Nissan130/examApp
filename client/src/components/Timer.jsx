import { useState, useEffect } from "react";

export default function Timer({ duration, onTimeUp }) {
  // Convert duration from minutes to seconds
  const [time, setTime] = useState(duration * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-lg font-bold text-red-600">
      Remaining Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
