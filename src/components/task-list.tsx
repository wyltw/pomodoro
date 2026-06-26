import type { FocusTask } from "@/lib/types/types";
import { cn } from "@/lib/utils/cn";

type TaskListProps = {
  tasks: FocusTask[];
  activeTaskId: string | undefined;
  onItemClick: (activeId: string) => void;
};

export function TaskList({ tasks, activeTaskId, onItemClick }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        No tasks yet. Add one to start focusing.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          className={cn(
            "bg-muted/50 flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:cursor-pointer active:cursor-pointer",
            { "bg-none outline-1": activeTaskId === task.id },
          )}
          key={task.id}
          onClick={() => onItemClick(task.id)}
        >
          <span className="min-w-0 truncate font-medium">{task.title}</span>
          <span className="text-muted-foreground shrink-0 tabular-nums">
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
        </li>
      ))}
    </ul>
  );
}
