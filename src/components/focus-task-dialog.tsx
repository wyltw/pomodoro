import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function FocusTaskDialog() {
  return (
    <Dialog>
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
        <form className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="focus-task-title">Title</FieldLabel>
            <Input
              id="focus-task-title"
              name="title"
              placeholder="What are you focusing on?"
              type="text"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="focus-task-estimated-pomodoros">
              Estimated Pomodoros
            </FieldLabel>
            <Input
              id="focus-task-estimated-pomodoros"
              inputMode="numeric"
              min={1}
              name="estimatedPomodoros"
              placeholder="1"
              type="number"
            />
          </Field>
          <DialogFooter>
            <Button type="submit">Save task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
