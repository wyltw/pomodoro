import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FocusTaskDialog } from "@/components/focus-task-dialog";
import { TaskList } from "@/components/task-list";
import type { FocusTask } from "@/lib/types/types";

const tasks: FocusTask[] = [
  {
    id: "focus-task-1",
    title: "Plan today's focus",
    estimatedPomodoros: 3,
    completedPomodoros: 0,
  },
];

export default function Todo() {
  return (
    <Collapsible className="group/collapsible bg-card text-card-foreground w-full max-w-md rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-medium">
            Today&apos;s Tasks
          </h2>
          <p className="text-muted-foreground text-sm">Current task:</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button
            aria-label="Toggle task details"
            size="icon"
            variant="ghost"
            className="shrink-0"
          >
            <ChevronDownIcon className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <FocusTaskDialog />
      <CollapsibleContent className="mt-4 space-y-3 border-t pt-4 text-sm">
        <TaskList tasks={tasks} />
      </CollapsibleContent>
    </Collapsible>
  );
}
