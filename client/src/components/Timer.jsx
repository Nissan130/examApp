import { useState, useEffect } from 'react';

export default function Timer({ duration, onTimeUp, onTimeUpdate }) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Calculate elapsed minutes for the backend
        const newElapsedMinutes = duration - (newTime / 60);
        if (Math.floor(newElapsedMinutes) > elapsedMinutes) {
          setElapsedMinutes(Math.floor(newElapsedMinutes));
          onTimeUpdate && onTimeUpdate(Math.floor(newElapsedMinutes));
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onTimeUp, onTimeUpdate, elapsedMinutes]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <span className="font-mono font-semibold">
      {formatTime(timeLeft)}
    </span>
  );
}