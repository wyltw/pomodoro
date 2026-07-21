import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";

type TimerToggleButtonProps = {
  disabled?: boolean;
  isRunning: boolean;
  onToggle: (isRunning: boolean) => Promise<void>;
};

export default function TimerToggleButton({
  disabled,
  isRunning,
  onToggle,
}: TimerToggleButtonProps) {
  return (
    <Button
      disabled={disabled}
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
