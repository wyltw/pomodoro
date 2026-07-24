"use client";

import { ListChecksIcon } from "lucide-react";
import { useEffect } from "react";

import { FocusTaskCreateForm } from "@/components/focus-task/focus-task-create-form";
import { FocusTaskList } from "@/components/focus-task/focus-task-list";
import { FocusTaskListSkeleton } from "@/components/focus-task/focus-task-list-skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import { useFocusTasks } from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export function FocusTaskSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { isSignedIn } = useAuthSession();
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);
  const replaceTasks = useDailyFocusTasksStore((state) => state.replaceTasks);
  const setActiveTask = useDailyFocusTasksStore((state) => state.setActiveTask);
  const {
    tasks: queriedTasks,
    error,
    isLoading,
  } = useFocusTasks({
    enabled: isSignedIn,
  });

  useEffect(() => {
    if (!queriedTasks) return;
    replaceTasks(queriedTasks);
  }, [queriedTasks, replaceTasks]);

  function handleItemClick(taskId: string) {
    setActiveTask(taskId);

    if (isMobile) setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center">
        <ListChecksIcon className="size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
        <h2 className="font-heading min-w-0 flex-1 truncate text-base font-medium group-data-[collapsible=icon]:hidden">
          Focus tasks
        </h2>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:hidden">
        <SidebarGroup>
          <FocusTaskCreateForm />
        </SidebarGroup>
        <SidebarGroup className="border-sidebar-border flex min-h-0 flex-1 flex-col border-t pt-4">
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error.message}
            </p>
          )}
          {!error &&
            (isLoading ? (
              <FocusTaskListSkeleton />
            ) : (
              <FocusTaskList
                tasks={tasks}
                activeTaskId={activeTaskId}
                onItemClick={handleItemClick}
              />
            ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
