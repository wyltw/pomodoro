"use client";

import { formatTime } from "@/lib/utils/utils";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressTrack,
  CircularProgressRange,
  CircularProgressValueText,
} from "./ui/circular-progress";
import {
  TimerContextProvider,
  useTimerData,
} from "@/lib/contexts/timer-context";
import TimerButtonList from "./timer-button-list";

export default function Pomodoro() {
  const sessionMax = 1500;
  const sessionMin = 0;

  return (
    <TimerContextProvider initialSeconds={sessionMin}>
      <PomodoroTimer sessionMax={sessionMax} sessionMin={sessionMin} />
    </TimerContextProvider>
  );
}

type PomodoroTimerProps = {
  sessionMax: number;
  sessionMin: number;
};

function PomodoroTimer({ sessionMax, sessionMin }: PomodoroTimerProps) {
  const { seconds } = useTimerData();

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
      <TimerButtonList />
    </div>
  );
}
