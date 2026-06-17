"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./timer";
import { TIMER_TAB_ITEMS } from "@/lib/constants";
import type { TimerType } from "@/lib/types/types";

export default function TimerTabs() {
  const [selectedTab, setSelectedTab] = useState<TimerType>("pomodoro");

  const handleContinue = () => {
    setSelectedTab("pomodoro");
  };

  const handleBreak = (type: Exclude<TimerType, "pomodoro">) => {
    setSelectedTab(type);
  };

  // Timer state should reset after tabs change because of mount

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => {
        setSelectedTab(value as TimerType);
      }}
      className="gap-4 px-4"
    >
      <TabsList className="self-center">
        {TIMER_TAB_ITEMS.map((item) => (
          <TabsTrigger
            className="text-base"
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="pomodoro">
        <Timer
          sessionMax={1500}
          sessionMin={0}
          onContinue={handleContinue}
          onBreak={handleBreak}
        />
      </TabsContent>
      <TabsContent value="shortBreak">
        <Timer
          sessionMax={300}
          sessionMin={0}
          onContinue={handleContinue}
          onBreak={handleBreak}
        />
      </TabsContent>
      <TabsContent value="longBreak">
        <Timer
          sessionMax={3}
          sessionMin={0}
          onContinue={handleContinue}
          onBreak={handleBreak}
        />
      </TabsContent>
    </Tabs>
  );
}
