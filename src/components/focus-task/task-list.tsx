import type { FocusTask } from "@/lib/types/types";
import { cn } from "@/lib/utils/cn";
import { CircleCheckBig } from "lucide-react";
import { TaskFilterValue } from "./task-filter";
import { useMemo } from "react";

type TaskListProps = {
  tasks: FocusTask[];
  activeTaskId: string | undefined;
  onItemClick: (activeId: string) => void;
  filter: TaskFilterValue;
};

export function TaskList({
  tasks,
  activeTaskId,
  onItemClick,
  filter,
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
        <li
          className={cn(
            "flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:cursor-pointer active:cursor-pointer",
            { "bg-accent shadow-sm outline-1": activeTaskId === task.id },
          )}
          key={task.id}
          onClick={() => onItemClick(task.id)}
        >
          <span className="min-w-0 truncate">{task.title}</span>
          <div className="flex gap-2">
            {task.completedPomodoros === task.estimatedPomodoros ? (
              <CircleCheckBig className="text-green-500" />
            ) : (
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {task.completedPomodoros}/{task.estimatedPomodoros}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
