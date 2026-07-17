"use client";

import { ListChecksIcon } from "lucide-react";
import { useEffect } from "react";

import { FocusTaskCreateForm } from "@/components/focus-task/focus-task-create-form";
import { FocusTaskList } from "@/components/focus-task/focus-task-list";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import { useFocusTasksQuery } from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export function FocusTaskSidebar() {
  const { isSignedIn } = useAuthSession();
  const localDate = useDailyFocusTasksStore((state) => state.localDate);
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);
  const replaceTasks = useDailyFocusTasksStore((state) => state.replaceTasks);
  const setActiveTask = useDailyFocusTasksStore((state) => state.setActiveTask);
  const {
    tasks: queriedTasks,
    error,
    isLoading,
  } = useFocusTasksQuery({
    enabled: isSignedIn,
    localDate,
  });

  useEffect(() => {
    if (!queriedTasks) return;
    replaceTasks(queriedTasks);
  }, [queriedTasks, replaceTasks]);

  return (
    <Sidebar>
      <SidebarHeader>
        <ListChecksIcon className="size-4 shrink-0 group-data-[state=collapsed]/sidebar:hidden" />
        <h2 className="font-heading min-w-0 flex-1 truncate text-sm font-medium group-data-[state=collapsed]/sidebar:hidden">
          Focus tasks
        </h2>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Add task</SidebarGroupLabel>
          <FocusTaskCreateForm />
        </SidebarGroup>
        <SidebarGroup className="border-sidebar-border border-t pt-4">
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error.message}
            </p>
          )}
          {!error &&
            (isLoading ? (
              <p className="text-muted-foreground text-sm">Loading tasks...</p>
            ) : (
              <FocusTaskList
                tasks={tasks}
                activeTaskId={activeTaskId}
                onItemClick={setActiveTask}
              />
            ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
