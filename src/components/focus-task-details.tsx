import type { FocusTask } from "@/lib/types/types";

type FocusTaskDetailsProps = {
  task: FocusTask;
};

export function FocusTaskDetails({ task }: FocusTaskDetailsProps) {
  return (
    <dl className="grid gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-6">
        <div className="grid min-w-0 gap-1">
          <dt className="text-muted-foreground text-sm font-medium">Title</dt>
          <dd className="truncate text-base">{task.title}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-muted-foreground text-sm font-medium">
            Estimated Pomodoros
          </dt>
          <dd className="text-xl tabular-nums">{task.estimatedPomodoros}</dd>
        </div>
      </div>
      <div className="grid gap-1">
        <dt className="text-muted-foreground text-sm font-medium">
          Description
        </dt>
        <dd className="text-base whitespace-pre-wrap">
          {task.description || "No description"}
        </dd>
      </div>
    </dl>
  );
}
