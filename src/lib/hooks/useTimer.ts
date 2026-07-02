import { useState, useEffect, useCallback } from "react";
import { useTimerStatus } from "@/lib/contexts/timer-status-context";

export const useTimer = (initialSeconds: number, endSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const { status, setStatus } = useTimerStatus();

  const stopTimer = useCallback(() => {
    setStatus("idle");
    setSeconds(initialSeconds);
  }, [initialSeconds, setStatus]);

  const pauseTimer = useCallback(() => {
    setStatus("paused");
  }, [setStatus]);

  const startTimer = useCallback(() => {
    setStatus("running");
  }, [setStatus]);

  useEffect(() => {
    return () => {
      setStatus("idle");
    };
  }, [setStatus]);

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
  }, [status, initialSeconds, endSeconds, setStatus]);
  return { seconds, status, startTimer, pauseTimer, stopTimer };
};
