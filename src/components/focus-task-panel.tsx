"use client";

import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export default function FocusTaskPanel() {
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);

  const focusingTask = tasks.find((task) => task.id === activeTaskId);

  if (!focusingTask) {
    return (
      <section className="bg-card text-card-foreground w-full max-w-md rounded-2xl border p-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-medium">Focusing task</h2>
          <p className="text-muted-foreground truncate text-sm">none</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card text-card-foreground w-full max-w-md rounded-2xl border p-4 shadow-sm">
      <div className="space-y-2">
        <h2 className="font-heading text-base font-medium">Focusing task</h2>
        <div className="space-y-2">
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs font-medium">Title</p>
            <p className="truncate text-sm font-medium">{focusingTask.title}</p>
          </div>
          {focusingTask.description && (
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs font-medium">
                Description
              </p>
              <p className="text-muted-foreground text-sm">
                {focusingTask.description}
              </p>
            </div>
          )}
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs font-medium">
              Pomodoros
            </p>
            <p className="text-muted-foreground text-sm tabular-nums">
              {focusingTask.completedPomodoros}/
              {focusingTask.estimatedPomodoros}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
