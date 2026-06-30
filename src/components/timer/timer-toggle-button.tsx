import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";

type TimerToggleButtonProps = {
  isRunning: boolean;
  onToggle: (isRunning: boolean) => Promise<void>;
};

export default function TimerToggleButton({
  isRunning,
  onToggle,
}: TimerToggleButtonProps) {
  return (
    <Button
      onClick={() => {
        onToggle(isRunning);
      }}
    >
      {isRunning ? (
        <Pause data-icon="inline-start" />
      ) : (
        <Play data-icon="inline-start" />
      )}
      <span className="hidden">
        {isRunning ? "pause timer" : "start timer"}
      </span>
    </Button>
  );
}
