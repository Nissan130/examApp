import { useState, useEffect } from 'react';

export default function Timer({ duration, onTimeUp, onTimeUpdate }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Calculate elapsed time correctly
        const newElapsedSeconds = (duration * 60) - newTime;
        setElapsedSeconds(newElapsedSeconds);
        
        // Send precise elapsed time in MINUTES (as float)
        const elapsedMinutes = newElapsedSeconds / 60;
        onTimeUpdate && onTimeUpdate(elapsedMinutes);
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <span className="font-mono font-semibold text-red-600">
      {formatTime(timeLeft)}
    </span>
  );
}