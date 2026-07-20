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

export default function TimerTabs() {
  const { isSignedIn } = useAuthSession();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<TimerType | "completed">(
    "pomodoro",
  );
  const localDate = useDailyFocusTasksStore((state) => state.localDate);
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
      await queryClient.invalidateQueries({
        queryKey: focusTasksQueryKey(localDate),
      });
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

  const handleComplete = (type: TimerType) => {
    if (type === "pomodoro") {
      if (isSignedIn) {
        mutation.mutate({
          taskId: activeTask?.id,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } else {
        completeActivePomodoro();
      }
    }

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
        <TabsTrigger value="pomodoro">
          <Clock5 data-icon="inline-start" />
          Pomodoro
        </TabsTrigger>
        <TabsTrigger value="shortBreak">
          <Coffee data-icon="inline-start" />
          Short Break
        </TabsTrigger>
        <TabsTrigger value="longBreak">
          <Armchair data-icon="inline-start" />
          Long Break
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pomodoro">
        <Timer
          sessionMax={3}
          sessionMin={0}
          onComplete={() => {
            handleComplete("pomodoro");
            void notifyUser("Pomodoro complete", "/sounds/decide2.wav", {
              body: activeTask
                ? `Finished focusing on "${activeTask.title}".`
                : "Your focus session has finished.",
            });
          }}
        />
      </TabsContent>
      <TabsContent value="shortBreak">
        <Timer
          sessionMax={300}
          sessionMin={0}
          onComplete={() => {
            handleComplete("shortBreak");
            void notifyUser("Short break over", "/sounds/decide24.mp3", {
              body: "Time to focus again.",
            });
          }}
        />
      </TabsContent>
      <TabsContent value="longBreak">
        <Timer
          sessionMax={900}
          sessionMin={0}
          onComplete={() => {
            handleComplete("longBreak");
            void notifyUser("Long break over", "/sounds/decide24.mp3", {
              body: "Ready for another focus session?",
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
