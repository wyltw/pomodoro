"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import NumberInput from "@/components/focus-task/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { focusTaskFormSchema } from "@/lib/schemas";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";

type FocusTaskCreateFormInput = z.input<typeof focusTaskFormSchema>;
type FocusTaskCreateFormValues = z.output<typeof focusTaskFormSchema>;

export function FocusTaskCreateForm() {
  const addTask = useDailyFocusTasksStore((state) => state.addTask);
  const form = useForm<
    FocusTaskCreateFormInput,
    unknown,
    FocusTaskCreateFormValues
  >({
    resolver: zodResolver(focusTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      estimatedPomodoros: 1,
    },
  });

  function onSubmit(values: FocusTaskCreateFormValues) {
    addTask(values);
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
              value={field.value ?? ""}
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
            <NumberInput
              {...field}
              aria-describedby={
                fieldState.error
                  ? "focus-task-estimated-pomodoros-error"
                  : undefined
              }
              aria-invalid={fieldState.invalid}
              id="focus-task-estimated-pomodoros"
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
