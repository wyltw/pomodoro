"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./timer";
import type { TimerType } from "@/lib/types/types";
import { Armchair, Clock5, Coffee } from "lucide-react";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import { useRequestNotification } from "@/lib/hooks/useRequestNotification";
import { TimerCompletedView } from "./timer-completed-view";

export default function TimerTabs() {
  useRequestNotification();
  const [selectedTab, setSelectedTab] = useState<TimerType | "completed">(
    "pomodoro",
  );
  const completeActivePomodoro = useDailyFocusTasksStore(
    (state) => state.completeActivePomodoro,
  );

  const handleContinue = () => {
    setSelectedTab("pomodoro");
  };

  const handleBreak = (type: Exclude<TimerType, "pomodoro">) => {
    setSelectedTab(type);
  };

  const handleComplete = (type: TimerType) => {
    if (type === "pomodoro") {
      completeActivePomodoro();
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
          onComplete={() => handleComplete("pomodoro")}
        />
      </TabsContent>
      <TabsContent value="shortBreak">
        <Timer
          sessionMax={300}
          sessionMin={0}
          onComplete={() => handleComplete("shortBreak")}
        />
      </TabsContent>
      <TabsContent value="longBreak">
        <Timer
          sessionMax={900}
          sessionMin={0}
          onComplete={() => handleComplete("longBreak")}
        />
      </TabsContent>
      <TabsContent value="completed">
        <TimerCompletedView onContinue={handleContinue} onBreak={handleBreak} />
      </TabsContent>
    </Tabs>
  );
}
