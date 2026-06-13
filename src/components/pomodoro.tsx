"use client";

import { formatTime } from "@/lib/utils/utils";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressTrack,
  CircularProgressRange,
  CircularProgressValueText,
} from "./ui/circular-progress";
import { useTimer } from "@/lib/hooks/useTimer";
import TimerToggleButton from "./timer-toggle-button";
import { Button } from "./ui/button";
import { Square } from "lucide-react";

export default function Pomodoro() {
  const sessionMax = 1500;
  const sessionMin = 0;
  const { seconds, status, pauseTimer, startTimer } = useTimer(sessionMin);

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <CircularProgress
        value={seconds}
        max={sessionMax}
        min={sessionMin}
        size={144}
        getValueText={(value) => {
          const secondsLeft = sessionMax - value;
          return formatTime(secondsLeft);
        }}
      >
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
        <CircularProgressValueText className="text-2xl" />
      </CircularProgress>
      <ul>
        <li>
          <TimerToggleButton
            isRunning={status === "running"}
            onToggle={(isRunning) => {
              if (isRunning) {
                pauseTimer();
              } else {
                startTimer();
              }
            }}
          />
          <Button>
            <Square />
          </Button>
        </li>
      </ul>
    </div>
  );
}
