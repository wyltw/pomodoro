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
  disabled?: boolean;
  sessionMax: number;
  sessionMin: number;
  onComplete?: (durationSeconds: number) => void;
};

export default function Timer({
  disabled,
  sessionMax,
  sessionMin,
  onComplete,
}: TimerProps) {
  return (
    <TimerContextProvider initialSeconds={sessionMin} endSeconds={sessionMax}>
      <div className="flex flex-col items-center gap-2">
        <CountdownTimer
          sessionMin={sessionMin}
          onComplete={onComplete}
          disabled={disabled}
        />
      </div>
    </TimerContextProvider>
  );
}

function CountdownTimer({
  disabled,
  sessionMin,
  onComplete,
}: Omit<TimerProps, "sessionMax">) {
  const { endSeconds, seconds, status } = useTimerData();
  const hasHandledCompletion = useRef(false);
  const handleComplete = useEffectEvent((durationSeconds: number) => {
    onComplete?.(durationSeconds);
  });

  useEffect(() => {
    if (status !== "completed") {
      hasHandledCompletion.current = false;
      return;
    }

    if (hasHandledCompletion.current) return;

    hasHandledCompletion.current = true;
    handleComplete(endSeconds - sessionMin);
  }, [endSeconds, sessionMin, status]);

  return (
    <>
      <CircularProgress
        value={seconds}
        max={endSeconds}
        min={sessionMin}
        size={208}
        thickness={8}
        getValueText={(value) => {
          const secondsLeft = endSeconds - value;
          return formatTime(secondsLeft);
        }}
      >
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressValueText className="text-4xl" />
      </CircularProgress>
      <TimerButtonList disabled={disabled} />
    </>
  );
}
