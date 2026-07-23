"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import {
  focusTasksQueryKey,
  useDeleteFocusTask,
} from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";

type FocusTaskDeleteDialogProps = {
  disabled: boolean;
  task: FocusTask;
};

export function FocusTaskDeleteDialog({
  disabled,
  task,
}: FocusTaskDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending: isAuthPending, isSignedIn } = useAuthSession();
  const queryClient = useQueryClient();
  const removeTask = useDailyFocusTasksStore((state) => state.removeTask);
  const mutation = useDeleteFocusTask({
    async onSuccess() {
      setIsOpen(false);
      toast.success("Focus task deleted.");
      await queryClient.invalidateQueries({
        queryKey: focusTasksQueryKey,
      });
    },
    onError(error) {
      toast.error(error.message || "Unable to delete focus task.");
    },
  });

  function handleOpenChange(open: boolean) {
    if (mutation.isPending) return;
    setIsOpen(open);
  }

  function handleDelete() {
    if (isAuthPending) return;

    if (isSignedIn) {
      mutation.mutate({ taskId: task.id });
      return;
    }

    removeTask(task.id);
    setIsOpen(false);
    toast.success("Focus task deleted.");
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          aria-label="Delete task"
          className="text-destructive hover:text-destructive"
          disabled={disabled || isAuthPending}
          size="icon-lg"
          title="Delete task"
          type="button"
          variant="ghost"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={!mutation.isPending}>
        <DialogHeader>
          <DialogTitle>Delete focus task?</DialogTitle>
          <DialogDescription>
            &ldquo;{task.title}&rdquo; will be permanently deleted. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={mutation.isPending}
            onClick={handleDelete}
            type="button"
            variant="destructive"
          >
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Trash2Icon />
            )}
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
