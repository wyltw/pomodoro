import type { TimerType } from "@/lib/types/types";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import { useTodayPomodoroCount } from "@/lib/hooks/pomodoro-session-hooks";
import { Button } from "../ui/button";

type TimerCompletedViewProps = {
  onContinue: () => void;
  onBreak: (type: Exclude<TimerType, "pomodoro">) => void;
};

export function TimerCompletedView({
  onContinue,
  onBreak,
}: TimerCompletedViewProps) {
  const { isPending: isAuthPending, isSignedIn } = useAuthSession();
  const { count, error, isLoading } = useTodayPomodoroCount({
    enabled: isSignedIn,
  });

  let message = "Sign in to track your daily Pomodoro statistics.";

  if (isAuthPending || (isSignedIn && isLoading)) {
    message = "Loading today's Pomodoro progress...";
  } else if (isSignedIn && error) {
    message = "Unable to load today's Pomodoro progress.";
  } else if (isSignedIn && count !== undefined) {
    message = `You have finished ${count} pomodoros today.`;
  }

  return (
    <div className="flex h-40 flex-col justify-center gap-2">
      <p className="text-xl">{message}</p>
      <div className="flex justify-center gap-2">
        <Button onClick={() => onBreak("shortBreak")}>Take a break</Button>
        <Button variant="secondary" onClick={onContinue}>
          Keep focusing
        </Button>
      </div>
    </div>
  );
}
