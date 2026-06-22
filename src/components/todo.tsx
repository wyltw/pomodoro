import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Todo() {
  return (
    <Collapsible className="group/collapsible bg-card text-card-foreground rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-medium">
            Today&apos;s Tasks
          </h2>
          <p className="text-muted-foreground text-sm">
            Finish one small task before starting your next pomodoro.
          </p>
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

      <CollapsibleContent className="mt-4 space-y-3 border-t pt-4 text-sm">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-primary size-4" />
          <span>Choose the three most important tasks for today</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-primary size-4" />
          <span>Set the focus goal for the next 25 minutes</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-primary size-4" />
          <span>Note your progress before taking a break</span>
        </label>
      </CollapsibleContent>
    </Collapsible>
  );
}
