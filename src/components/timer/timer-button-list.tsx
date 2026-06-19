import { RotateCcw } from "lucide-react";
import TimerToggleButton from "./timer-toggle-button";
import { Button } from "../ui/button";
import { useTimerApi, useTimerData } from "@/lib/contexts/timer-context";

export default function TimerButtonList() {
  const { status } = useTimerData();
  const { pauseTimer, startTimer, stopTimer } = useTimerApi();

  return (
    <ul className="flex gap-2">
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
      </li>
      <li>
        <Button onClick={stopTimer}>
          <RotateCcw />
          <span className="hidden">reset timer</span>
        </Button>
      </li>
    </ul>
  );
}
