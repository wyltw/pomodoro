"use client";

import { useEffect } from "react";
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
import { Button } from "../ui/button";
import type { TimerType } from "@/lib/types/types";

type TimerProps = {
  sessionMax: number;
  sessionMin: number;
  onComplete?: () => void;
  onContinue: () => void;
  onBreak: (type: Exclude<TimerType, "pomodoro">) => void;
};

export default function Timer({
  sessionMax,
  sessionMin,
  onComplete,
  onContinue,
  onBreak,
}: TimerProps) {
  return (
    <TimerContextProvider initialSeconds={sessionMin} endSeconds={sessionMax}>
      <div className="flex flex-col items-center gap-2">
        <CountdownTimer
          sessionMax={sessionMax}
          sessionMin={sessionMin}
          onComplete={onComplete}
          onContinue={onContinue}
          onBreak={onBreak}
        />
      </div>
    </TimerContextProvider>
  );
}

function CountdownTimer({
  sessionMax,
  sessionMin,
  onComplete,
  onContinue,
  onBreak,
}: TimerProps) {
  const { seconds, status } = useTimerData();

  useEffect(() => {
    if (status !== "completed") return;
    const notification = new Notification("To do list", {
      body: "session Finished",
    });
    onComplete?.();
  }, [onComplete, status]);

  if (status === "completed") {
    return <TimerCompletedView onContinue={onContinue} onBreak={onBreak} />;
  }

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

type TimerCompletedViewProps = Pick<TimerProps, "onContinue" | "onBreak">;

function TimerCompletedView({ onContinue, onBreak }: TimerCompletedViewProps) {
  const pomodoros = 3;

  return (
    <>
      <p className="text-xl">You have finished {pomodoros} pomodoros today.</p>
      <div className="flex gap-2">
        <Button onClick={() => onBreak("shortBreak")}>Take a break</Button>
        <Button
          variant="secondary"
          onClick={() => {
            onContinue();
          }}
        >
          Keep focusing
        </Button>
      </div>
    </>
  );
}
