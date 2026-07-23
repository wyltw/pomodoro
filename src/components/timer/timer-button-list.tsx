import { RotateCcw } from "lucide-react";
import TimerToggleButton from "./timer-toggle-button";
import { Button } from "../ui/button";
import { useTimerApi, useTimerData } from "@/lib/contexts/timer-context";
import { requestNotification } from "@/lib/utils/utils";
import { toast } from "sonner";

type TimerButtonListProps = {
  disabled?: boolean;
};

export default function TimerButtonList({ disabled }: TimerButtonListProps) {
  const { status } = useTimerData();
  const { pauseTimer, startTimer, stopTimer } = useTimerApi();

  return (
    <ul className="flex gap-2">
      <li>
        <TimerToggleButton
          disabled={disabled}
          isRunning={status === "running"}
          onToggle={async (isRunning) => {
            if (isRunning) {
              pauseTimer();
            } else {
              startTimer();
              const permission = await requestNotification();
              if (permission === "denied")
                toast.info(
                  "Allow notifications to get alerted when a Pomodoro finishes.",
                );
            }
          }}
        />
      </li>
      <li>
        <Button disabled={disabled} onClick={stopTimer}>
          <RotateCcw />
          <span className="hidden">reset timer</span>
        </Button>
      </li>
    </ul>
  );
}
