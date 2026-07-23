"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./timer";
import type { TimerType } from "@/lib/types/types";
import { Armchair, Clock5, Coffee } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import {
  focusTasksQueryKey,
  useCompletePomodoro,
} from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import { TimerCompletedView } from "./timer-completed-view";
import { notifyUser } from "@/lib/utils/utils";
import { todayPomodoroCountQueryKey } from "@/lib/hooks/pomodoro-session-hooks";
import { useTimerSettingsStore } from "@/lib/stores/timer-settings-store";

export default function TimerTabs() {
  const { isSignedIn } = useAuthSession();
  const queryClient = useQueryClient();
  const pomodoroMinutes = useTimerSettingsStore(
    (state) => state.pomodoroMinutes,
  );
  const notificationVolume = useTimerSettingsStore(
    (state) => state.notificationVolume,
  );
  const pomodoroDurationSeconds = pomodoroMinutes * 60;
  const [selectedTab, setSelectedTab] = useState<TimerType | "completed">(
    "pomodoro",
  );
  const completeActivePomodoro = useDailyFocusTasksStore(
    (state) => state.completeActivePomodoro,
  );
  const clearActiveTask = useDailyFocusTasksStore(
    (state) => state.clearActiveTask,
  );
  const activeTask = useDailyFocusTasksStore((state) =>
    state.tasks.find((task) => task.id === state.activeTaskId),
  );
  const mutation = useCompletePomodoro({
    async onSuccess({ completedTaskId }) {
      if (completedTaskId) clearActiveTask();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: focusTasksQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: todayPomodoroCountQueryKey,
        }),
      ]);
      setSelectedTab("completed");
    },
    onError(error) {
      toast.error(error.message || "Unable to save this Pomodoro.");
    },
  });

  const handleContinue = () => {
    setSelectedTab("pomodoro");
  };

  const handleBreak = (type: Exclude<TimerType, "pomodoro">) => {
    setSelectedTab(type);
  };

  const handlePomodoroComplete = (durationSeconds: number) => {
    if (!isSignedIn) {
      completeActivePomodoro();
      setSelectedTab("completed");
      return;
    }

    if (mutation.isPending) return;

    mutation.mutate({
      durationSeconds,
      taskId: activeTask?.id,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  const handleBreakComplete = () => {
    setSelectedTab("completed");
  };

  // Timer state should reset after tabs change because of mount

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => {
        setSelectedTab(value as TimerType);
      }}
      className="mt-4 gap-4"
    >
      <TabsList className="self-center">
        <TabsTrigger value="pomodoro" disabled={mutation.isPending}>
          <Clock5 data-icon="inline-start" />
          Pomodoro
        </TabsTrigger>
        <TabsTrigger value="shortBreak" disabled={mutation.isPending}>
          <Coffee data-icon="inline-start" />
          Short Break
        </TabsTrigger>
        <TabsTrigger value="longBreak" disabled={mutation.isPending}>
          <Armchair data-icon="inline-start" />
          Long Break
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pomodoro">
        <Timer
          disabled={mutation.isPending}
          sessionMax={pomodoroDurationSeconds}
          sessionMin={0}
          onComplete={(durationSeconds) => {
            handlePomodoroComplete(durationSeconds);
            void notifyUser("Pomodoro complete", "/sounds/decide2.wav", {
              body: activeTask
                ? `Finished focusing on "${activeTask.title}".`
                : "Your focus session has finished.",
              volume: notificationVolume,
            });
          }}
        />
        {mutation.isPending && (
          <p className="text-muted-foreground text-center text-sm">
            Saving Pomodoro...
          </p>
        )}
      </TabsContent>
      <TabsContent value="shortBreak">
        <Timer
          sessionMax={300}
          sessionMin={0}
          onComplete={() => {
            handleBreakComplete();
            void notifyUser("Short break over", "/sounds/decide24.mp3", {
              body: "Time to focus again.",
              volume: notificationVolume,
            });
          }}
        />
      </TabsContent>
      <TabsContent value="longBreak">
        <Timer
          sessionMax={900}
          sessionMin={0}
          onComplete={() => {
            handleBreakComplete();
            void notifyUser("Long break over", "/sounds/decide24.mp3", {
              body: "Ready for another focus session?",
              volume: notificationVolume,
            });
          }}
        />
      </TabsContent>
      <TabsContent value="completed">
        <TimerCompletedView onContinue={handleContinue} onBreak={handleBreak} />
      </TabsContent>
    </Tabs>
  );
}
