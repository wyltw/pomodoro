import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";

type TimerToggleButtonProps = {
  isRunning: boolean;
  onToggle: (isRunning: boolean) => void;
};

export default function TimerToggleButton({
  isRunning,
  onToggle,
}: TimerToggleButtonProps) {
  return (
    <Button
      className=""
      variant={"default"}
      onClick={() => {
        onToggle(isRunning);
      }}
    >
      {isRunning ? <Pause /> : <Play />}
      <span className="hidden">
        {isRunning ? "pause timer" : "start timer"}
      </span>
    </Button>
  );
}
