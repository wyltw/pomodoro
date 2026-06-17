import { useState, useEffect, useCallback } from "react";

type TimerStatus = "idle" | "running" | "paused" | "completed";

export const useTimer = (initialSeconds: number, endSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>("idle");

  const stopTimer = useCallback(() => {
    setStatus("idle");
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const pauseTimer = useCallback(() => {
    setStatus("paused");
  }, []);

  const startTimer = useCallback(() => {
    setStatus("running");
  }, []);

  useEffect(() => {
    if (status !== "running") return;

    // status changes trigger cleaner function, so countdown will stop automatically
    const intervalId = setInterval(() => {
      setSeconds((prev) => {
        const nextSeconds = Math.min(prev + 1, endSeconds);
        if (prev >= endSeconds) {
          setStatus("completed");
          return initialSeconds;
        }

        return nextSeconds;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [status, initialSeconds, endSeconds]);
  return { seconds, status, startTimer, pauseTimer, stopTimer };
};
