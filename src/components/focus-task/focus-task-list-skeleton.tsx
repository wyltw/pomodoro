import { Skeleton } from "@/components/ui/skeleton";

export function FocusTaskListSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Loading tasks">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
