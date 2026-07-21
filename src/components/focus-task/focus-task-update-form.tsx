"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon, Undo2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import {
  focusTasksQueryKey,
  useUpdateFocusTask,
} from "@/lib/hooks/focus-task-hooks";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";
import NumberInput from "./number-input";

function createFocusTaskUpdateFormSchema(completedPomodoros: number) {
  const minimumEstimatedPomodoros = Math.max(1, completedPomodoros);
  const minimumEstimatedPomodorosError =
    completedPomodoros > 0
      ? `Estimated Pomodoros cannot be less than the ${completedPomodoros} already completed.`
      : "Enter at least 1.";

  return z.object({
    title: z.string().trim().min(1, { error: "Title is required." }),
    description: z.string().trim(),
    estimatedPomodoros: z
      .number({ error: "Estimated Pomodoros is required." })
      .min(minimumEstimatedPomodoros, {
        error: minimumEstimatedPomodorosError,
      })
      .max(8, { error: "Consider splitting this into smaller tasks." }),
  });
}

type FocusTaskUpdateFormSchema = ReturnType<
  typeof createFocusTaskUpdateFormSchema
>;
type FocusTaskUpdateFormInput = z.input<FocusTaskUpdateFormSchema>;
type FocusTaskUpdateFormValues = z.output<FocusTaskUpdateFormSchema>;

type FocusTaskUpdateFormProps = {
  task: FocusTask;
  onEditingEnd: () => void;
};

export function FocusTaskUpdateForm({
  task,
  onEditingEnd,
}: FocusTaskUpdateFormProps) {
  const { isPending: isAuthPending, isSignedIn } = useAuthSession();
  const queryClient = useQueryClient();
  const updateTask = useDailyFocusTasksStore((state) => state.updateTask);
  const mutation = useUpdateFocusTask({
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: focusTasksQueryKey,
      });
      toast.success("Focus task updated.");
      onEditingEnd();
    },
    onError(error) {
      toast.error(error.message || "Unable to update focus task.");
    },
  });
  const focusTaskUpdateFormSchema = createFocusTaskUpdateFormSchema(
    task.completedPomodoros,
  );
  const form = useForm<
    FocusTaskUpdateFormInput,
    unknown,
    FocusTaskUpdateFormValues
  >({
    resolver: zodResolver(focusTaskUpdateFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      estimatedPomodoros: task.estimatedPomodoros,
    },
  });

  function onSubmit(values: FocusTaskUpdateFormValues) {
    if (isAuthPending) return;

    if (isSignedIn) {
      mutation.mutate({ taskId: task.id, payload: values });
      return;
    }

    updateTask(task.id, values);
    form.reset(values);
    toast.success("Focus task updated.");
    onEditingEnd();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset
        className="grid gap-4"
        disabled={isAuthPending || mutation.isPending}
      >
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="focus-task-update-title">Title</FieldLabel>
              <Input
                {...field}
                aria-describedby={
                  fieldState.error ? "focus-task-update-title-error" : undefined
                }
                aria-invalid={fieldState.invalid}
                id="focus-task-update-title"
                type="text"
              />
              <FieldError
                errors={[fieldState.error]}
                id="focus-task-update-title-error"
              />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="focus-task-update-description">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                aria-describedby={
                  fieldState.error
                    ? "focus-task-update-description-error"
                    : undefined
                }
                aria-invalid={fieldState.invalid}
                id="focus-task-update-description"
                placeholder="Add a short note"
              />
              <FieldError
                errors={[fieldState.error]}
                id="focus-task-update-description-error"
              />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="estimatedPomodoros"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="focus-task-update-estimated-pomodoros">
                Estimated Pomodoros
              </FieldLabel>
              <NumberInput
                {...field}
                aria-describedby={
                  fieldState.error
                    ? "focus-task-update-estimated-pomodoros-error"
                    : undefined
                }
                aria-invalid={fieldState.invalid}
                id="focus-task-update-estimated-pomodoros"
                inputMode="numeric"
                onChange={async (event) => {
                  const value = Math.max(0, Number(event.currentTarget.value));
                  event.currentTarget.value = String(value);
                  field.onChange(value);
                  await form.trigger("estimatedPomodoros");
                }}
                onIncrease={() => {
                  const value = field.value;
                  form.setValue("estimatedPomodoros", Math.min(9, value + 1), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onDecrease={() => {
                  const value = field.value;
                  form.setValue("estimatedPomodoros", Math.max(0, value - 1), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                type="number"
                value={Number.isNaN(field.value) ? "" : field.value}
              />
              <FieldError
                errors={[fieldState.error]}
                id="focus-task-update-estimated-pomodoros-error"
              />
            </Field>
          )}
        />

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={!form.formState.isDirty}>
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SaveIcon />
            )}
            Update task
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset({
                title: task.title,
                description: task.description ?? "",
                estimatedPomodoros: task.estimatedPomodoros,
              });
              onEditingEnd();
            }}
          >
            <Undo2Icon />
            Cancel
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
