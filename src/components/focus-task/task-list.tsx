import type { FocusTask } from "@/lib/types/types";
import { cn } from "@/lib/utils/cn";
import { CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskFilterValue } from "./task-filter";
import { useMemo } from "react";

type TaskListProps = {
  tasks: FocusTask[];
  activeTaskId: string | undefined;
  onItemClick: (activeId: string) => void;
  filter: TaskFilterValue;
  disabled: boolean;
};

export function TaskList({
  tasks,
  activeTaskId,
  onItemClick,
  filter,
  disabled,
}: TaskListProps) {
  const filterTask = (value: TaskFilterValue) => {
    const methods = {
      all: () => true,
      completed: (task: FocusTask) =>
        task.estimatedPomodoros === task.completedPomodoros,
      incomplete: (task: FocusTask) =>
        task.completedPomodoros < task.estimatedPomodoros,
    };
    return methods[value];
  };

  const filteredTask = useMemo(
    () => tasks.filter(filterTask(filter)),
    [tasks, filter],
  );

  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No tasks yet. Add one to start focusing.
      </p>
    );
  }

  if (filteredTask.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No tasks match this filter.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {filteredTask.map((task) => (
        <li key={task.id}>
          <Button
            className={cn(
              "h-auto w-full justify-between gap-3 rounded-md px-3 py-2 font-normal whitespace-normal",
              {
                "bg-accent hover:bg-accent ring-border shadow-sm":
                  activeTaskId === task.id,
              },
            )}
            disabled={disabled}
            onClick={() => onItemClick(task.id)}
            type="button"
            variant="outline"
          >
            <span className="min-w-0 truncate">{task.title}</span>
            <span className="flex gap-2">
              {task.completedPomodoros === task.estimatedPomodoros ? (
                <CircleCheckBig className="size-5 text-green-500" />
              ) : (
                <span className="text-muted-foreground shrink-0 tabular-nums">
                  {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
              )}
            </span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
