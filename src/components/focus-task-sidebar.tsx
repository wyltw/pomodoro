"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListChecksIcon, PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

const focusTaskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim(),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, "Estimated Pomodoros must be at least 1.")
    .max(8, "Estimated Pomodoros must be 8 or less."),
});

type FocusTaskFormInput = z.input<typeof focusTaskFormSchema>;
type FocusTaskFormValues = z.output<typeof focusTaskFormSchema>;

export function FocusTaskSidebar() {
  const tasks = useDailyFocusTasksStore((state) => state.tasks);
  const activeTaskId = useDailyFocusTasksStore((state) => state.activeTaskId);
  const setActiveTask = useDailyFocusTasksStore((state) => state.setActiveTask);

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
          <FocusTaskForm />
        </SidebarGroup>
        <SidebarGroup className="border-sidebar-border border-t pt-4">
          <SidebarGroupLabel>Today&apos;s tasks</SidebarGroupLabel>
          <TaskList
            tasks={tasks}
            activeTaskId={activeTaskId}
            onItemClick={setActiveTask}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function FocusTaskForm() {
  const addTask = useDailyFocusTasksStore((state) => state.addTask);
  const form = useForm<FocusTaskFormInput, unknown, FocusTaskFormValues>({
    resolver: zodResolver(focusTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      estimatedPomodoros: 1,
    },
  });

  function onSubmit(values: FocusTaskFormValues) {
    const { title, description, estimatedPomodoros } = values;
    addTask({
      title,
      description,
      estimatedPomodoros,
    });
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="focus-task-title">Title</FieldLabel>
            <Input
              {...field}
              aria-describedby={
                fieldState.error ? "focus-task-title-error" : undefined
              }
              aria-invalid={fieldState.invalid}
              id="focus-task-title"
              placeholder="What are you focusing on?"
              type="text"
            />
            <FieldError
              errors={[fieldState.error]}
              id="focus-task-title-error"
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="focus-task-description">
              Description
            </FieldLabel>
            <Input
              {...field}
              aria-describedby={
                fieldState.error ? "focus-task-description-error" : undefined
              }
              aria-invalid={fieldState.invalid}
              id="focus-task-description"
              placeholder="Add a short note"
              type="text"
            />
            <FieldError
              errors={[fieldState.error]}
              id="focus-task-description-error"
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="estimatedPomodoros"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="focus-task-estimated-pomodoros">
              Estimated Pomodoros
            </FieldLabel>
            <Input
              {...field}
              aria-describedby={
                fieldState.error
                  ? "focus-task-estimated-pomodoros-error"
                  : undefined
              }
              aria-invalid={fieldState.invalid}
              id="focus-task-estimated-pomodoros"
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
              placeholder="1"
              type="number"
              value={Number.isNaN(field.value) ? "" : field.value}
            />
            <FieldError
              errors={[fieldState.error]}
              id="focus-task-estimated-pomodoros-error"
            />
          </Field>
        )}
      />
      <Button type="submit">
        <PlusIcon />
        Save task
      </Button>
    </form>
  );
}
