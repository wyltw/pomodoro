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

type TimerProps = {
  sessionMax: number;
  sessionMin: number;
};

export default function Timer({ sessionMax, sessionMin }: TimerProps) {
  return (
    <TimerContextProvider initialSeconds={sessionMin}>
      <CountdownTimer sessionMax={sessionMax} sessionMin={sessionMin} />
    </TimerContextProvider>
  );
}

function CountdownTimer({ sessionMax, sessionMin }: TimerProps) {
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
