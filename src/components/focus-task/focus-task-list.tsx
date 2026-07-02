import { useState } from "react";

import {
  TaskFilter,
  type TaskFilterValue,
} from "@/components/focus-task/task-filter";
import { TaskList } from "@/components/focus-task/task-list";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { useTimerStatus } from "@/lib/contexts/timer-status-context";
import type { FocusTask } from "@/lib/types/types";

type FocusTaskListProps = {
  tasks: FocusTask[];
  activeTaskId: string | undefined;
  onItemClick: (activeId: string) => void;
};

export function FocusTaskList({
  tasks,
  activeTaskId,
  onItemClick,
}: FocusTaskListProps) {
  const [filter, setFilter] = useState<TaskFilterValue>("all");
  const { status } = useTimerStatus();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <SidebarGroupLabel>Today&apos;s tasks</SidebarGroupLabel>
        <TaskFilter value={filter} onValueChange={setFilter} />
      </div>
      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        onItemClick={onItemClick}
        filter={filter}
        disabled={status === "running"}
      />
    </>
  );
}
