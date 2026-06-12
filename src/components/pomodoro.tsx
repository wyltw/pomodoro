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
import { Pause, Play } from "lucide-react";
import { Button } from "./ui/button";

export default function Pomodoro() {
  const sessionMax = 1500;
  const sessionMin = 0;
  const { seconds, pauseTimer, startTimer } = useTimer(sessionMin);

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
          <Button className="" variant={"default"} onClick={startTimer}>
            <Play />
          </Button>
        </li>
      </ul>
    </div>
  );
}
