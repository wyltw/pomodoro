"use client";

import { ListChecksIcon } from "lucide-react";

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
import { useCurrentFocusTasks } from "@/lib/hooks/useCurrentFocusTasks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

export function FocusTaskSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { isPending: isAuthPending, isSignedIn } = useAuthSession();
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);
  const setActiveTask = useDailyFocusTasksStore((state) => state.setActiveTask);
  const { tasks, error, isLoading } = useCurrentFocusTasks(isSignedIn);

  function handleItemClick(taskId: string) {
    setActiveTask(taskId, tasks);

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
          <FocusTaskCreateForm
            isAuthPending={isAuthPending}
            isSignedIn={isSignedIn}
          />
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
