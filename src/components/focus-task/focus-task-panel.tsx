"use client";

import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDailyFocusTasksStore } from "@/lib/stores/daily-focus-tasks-store";
import { FocusTaskDetails } from "./focus-task-details";
import { FocusTaskUpdateForm } from "./focus-task-update-form";

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
      <Card className="w-full max-w-md self-start">
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
              size="icon-lg"
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
              size="icon-lg"
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
          Completed sessions count toward this task while it&apos;s active
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <FocusTaskUpdateForm
            key={focusingTask.id}
            task={focusingTask}
            onEditingEnd={stopEditing}
          />
        ) : (
          <FocusTaskDetails task={focusingTask} />
        )}
      </CardContent>
    </Card>
  );
}
