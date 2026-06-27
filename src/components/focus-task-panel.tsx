"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, SquarePenIcon, Trash2Icon, Undo2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";

const focusTaskUpdateFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim(),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, "Estimated Pomodoros must be at least 1.")
    .max(8, "Estimated Pomodoros must be 8 or less."),
});

type FocusTaskUpdateFormInput = z.input<typeof focusTaskUpdateFormSchema>;
type FocusTaskUpdateFormValues = z.output<typeof focusTaskUpdateFormSchema>;

export default function FocusTaskPanel() {
  const [isEditing, setIsEditing] = useState(false);
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);

  const focusingTask = tasks.find((task) => task.id === activeTaskId);

  function startEditing() {
    setIsEditing(true);
  }

  function stopEditing() {
    setIsEditing(false);
  }

  if (!focusingTask) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">
            <h2>Now Focusing</h2>
          </CardTitle>
          <CardDescription>No task selected</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md self-start rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <h2>Now Focusing</h2>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Edit task"
              title="Edit task"
              disabled={isEditing}
              onClick={startEditing}
            >
              <SquarePenIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              aria-label="Delete task"
              disabled={isEditing}
              title="Delete task"
            >
              <Trash2Icon />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {focusingTask.completedPomodoros}/{focusingTask.estimatedPomodoros}{" "}
          pomodoros completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FocusTaskUpdateForm
          key={focusingTask.id}
          task={focusingTask}
          isEditing={isEditing}
          onEditingEnd={stopEditing}
        />
      </CardContent>
    </Card>
  );
}

type FocusTaskUpdateFormProps = {
  task: FocusTask;
  isEditing: boolean;
  onEditingEnd: () => void;
};

function FocusTaskUpdateForm({
  task,
  isEditing,
  onEditingEnd,
}: FocusTaskUpdateFormProps) {
  const updateTask = useDailyFocusTasksStore((state) => state.updateTask);
  const form = useForm<
    FocusTaskUpdateFormInput,
    unknown,
    FocusTaskUpdateFormValues
  >({
    resolver: zodResolver(focusTaskUpdateFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      estimatedPomodoros: task.estimatedPomodoros,
    },
  });

  function onSubmit(values: FocusTaskUpdateFormValues) {
    updateTask(task.id, values);
    form.reset(values);
    onEditingEnd();
  }

  if (!isEditing) {
    return (
      <dl className="grid gap-4">
        <div className="grid gap-1">
          <dt className="text-sm font-medium">Title</dt>
          <dd className="text-sm">{task.title}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-sm font-medium">Description</dt>
          <dd className="text-muted-foreground text-sm whitespace-pre-wrap">
            {task.description || "No description"}
          </dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-sm font-medium">Estimated Pomodoros</dt>
          <dd className="text-sm tabular-nums">{task.estimatedPomodoros}</dd>
        </div>
      </dl>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
            <Input
              {...field}
              aria-describedby={
                fieldState.error
                  ? "focus-task-update-estimated-pomodoros-error"
                  : undefined
              }
              aria-invalid={fieldState.invalid}
              id="focus-task-update-estimated-pomodoros"
              inputMode="numeric"
              max={8}
              min={1}
              onChange={(event) =>
                field.onChange(
                  event.currentTarget.value === ""
                    ? undefined
                    : event.currentTarget.valueAsNumber,
                )
              }
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
          <SaveIcon />
          Update task
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset(task);
            onEditingEnd();
          }}
        >
          <Undo2Icon />
          Cancel
        </Button>
      </div>
    </form>
  );
}
