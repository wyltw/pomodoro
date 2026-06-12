import { useState, useEffect } from "react";

type TimerStatus = "play" | "pause" | "stop";

export const useTimer = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>("stop");

  const stopTimer = () => {
    setStatus("stop");
    setSeconds(0);
  };

  const pauseTimer = () => {
    setStatus("pause");
  };

  const startTimer = () => {
    setStatus("play");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status === "play") setSeconds((prev) => prev + 1);
    }, 1000);
    if (status === "pause" || status === "stop") clearInterval(intervalId);
    return () => {
      clearInterval(intervalId);
    };
  }, [status, seconds]);
  return { seconds, status, startTimer, pauseTimer, stopTimer };
};
