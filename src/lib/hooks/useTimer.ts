import { useState, useEffect, useCallback } from "react";

type TimerStatus = "idle" | "running" | "paused";

export const useTimer = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const stopTimer = useCallback(() => {
    setStatus("idle");
    setSeconds(0);
  }, []);

  const pauseTimer = useCallback(() => {
    setStatus("paused");
  }, []);

  const startTimer = useCallback(() => {
    setStatus("running");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (status === "running") setSeconds((prev) => prev + 1);
    }, 1000);
    if (status === "paused" || status === "idle") clearInterval(intervalId);
    return () => {
      clearInterval(intervalId);
    };
  }, [status, seconds]);
  return { seconds, status, startTimer, pauseTimer, stopTimer };
};
