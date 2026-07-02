import { ListFilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export type TaskFilterValue = "all" | "completed" | "incomplete";

type TaskFilterProps = {
  value: TaskFilterValue;
  onValueChange: (value: TaskFilterValue) => void;
};

export function TaskFilter({ value, onValueChange }: TaskFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger asChild>
        <Button
          aria-label="Filter tasks"
          size="icon-sm"
          title="Filter tasks"
          type="button"
          variant="ghost"
        >
          <ListFilterIcon />
        </Button>
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="incomplete">Incomplete</SelectItem>
      </SelectContent>
    </Select>
  );
}
