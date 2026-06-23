import type { FocusTask } from "@/lib/types/types";

type TaskListProps = {
  tasks: FocusTask[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          className="bg-muted/50 flex items-center justify-between gap-3 rounded-2xl px-3 py-2"
          key={task.id}
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
