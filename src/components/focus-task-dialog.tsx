import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import { useState } from "react";

const focusTaskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  estimatedPomodoros: z
    .number({ error: "Estimated Pomodoros is required." })
    .min(1, "Estimated Pomodoros must be at least 1.")
    .max(8, "Estimated Pomodoros must be 8 or less."),
});

type FocusTaskFormInput = z.input<typeof focusTaskFormSchema>;
type FocusTaskFormValues = z.output<typeof focusTaskFormSchema>;

export function FocusTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const addTask = useDailyFocusTasksStore((state) => state.addTask);

  const form = useForm<FocusTaskFormInput, unknown, FocusTaskFormValues>({
    resolver: zodResolver(focusTaskFormSchema),
    defaultValues: {
      title: "",
      estimatedPomodoros: 1,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset();
    setIsOpen(open);
  };

  function onSubmit(values: FocusTaskFormValues) {
    const { title, estimatedPomodoros } = values;
    addTask({
      title,
      estimatedPomodoros,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full">
          <PlusIcon />
          Add task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add focus task</DialogTitle>
          <DialogDescription>
            Set the task and estimated pomodoro count.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant={"secondary"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
