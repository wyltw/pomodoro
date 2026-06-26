"use client";

import { ChevronDownIcon } from "lucide-react";

import { FocusTaskDialog } from "@/components/focus-task-dialog";
import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export default function FocusTaskPanel() {
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);
  const setActiveTask = useDailyFocusTasksStore((state) => state.setActiveTask);

  const focusingTask = tasks.find((task) => task.id === activeTaskId);
  return (
    <Collapsible
      defaultOpen={true}
      className="group/collapsible bg-card text-card-foreground w-full max-w-md rounded-2xl border p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h2 className="font-heading text-base font-medium">
            Today&apos;s Tasks
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Focusing task:</span>
            <span className="flex-1 truncate text-center text-base text-black">
              {focusingTask?.title || "none"}
            </span>
          </p>
        </div>
        <CollapsibleTrigger asChild>
          <Button
            aria-label="Toggle task details"
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <ChevronDownIcon className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <FocusTaskDialog />
      <CollapsibleContent className="mt-4 space-y-3 border-t pt-4">
        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onItemClick={setActiveTask}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
