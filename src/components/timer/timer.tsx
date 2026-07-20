"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { formatTime } from "@/lib/utils/utils";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressTrack,
  CircularProgressRange,
  CircularProgressValueText,
} from "../ui/circular-progress";
import {
  TimerContextProvider,
  useTimerData,
} from "@/lib/contexts/timer-context";
import TimerButtonList from "./timer-button-list";

type TimerProps = {
  sessionMax: number;
  sessionMin: number;
  onComplete?: () => void;
};

export default function Timer({
  sessionMax,
  sessionMin,
  onComplete,
}: TimerProps) {
  return (
    <TimerContextProvider initialSeconds={sessionMin} endSeconds={sessionMax}>
      <div className="flex flex-col items-center gap-2">
        <CountdownTimer
          sessionMax={sessionMax}
          sessionMin={sessionMin}
          onComplete={onComplete}
        />
      </div>
    </TimerContextProvider>
  );
}

function CountdownTimer({ sessionMax, sessionMin, onComplete }: TimerProps) {
  const { seconds, status } = useTimerData();
  const hasHandledCompletion = useRef(false);
  const handleComplete = useEffectEvent(() => {
    onComplete?.();
  });

  useEffect(() => {
    if (status !== "completed") {
      hasHandledCompletion.current = false;
      return;
    }

    if (hasHandledCompletion.current) return;

    hasHandledCompletion.current = true;
    handleComplete();
  }, [status]);

  return (
    <>
      <CircularProgress
        value={seconds}
        max={sessionMax}
        min={sessionMin}
        size={208}
        thickness={8}
        getValueText={(value) => {
          const secondsLeft = sessionMax - value;
          return formatTime(secondsLeft);
        }}
      >
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressValueText className="text-4xl" />
      </CircularProgress>
      <TimerButtonList />
    </>
  );
}
