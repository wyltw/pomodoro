import type { TimerType } from "@/lib/types/types";
import { Button } from "../ui/button";

type TimerCompletedViewProps = {
  onContinue: () => void;
  onBreak: (type: Exclude<TimerType, "pomodoro">) => void;
};

export function TimerCompletedView({
  onContinue,
  onBreak,
}: TimerCompletedViewProps) {
  const pomodoros = 3;

  return (
    <div className="flex h-40 flex-col justify-center gap-2">
      <p className="text-xl">You have finished {pomodoros} pomodoros today.</p>
      <div className="flex justify-center gap-2">
        <Button onClick={() => onBreak("shortBreak")}>Take a break</Button>
        <Button variant="secondary" onClick={onContinue}>
          Keep focusing
        </Button>
      </div>
    </div>
  );
}
