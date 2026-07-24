import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import FocusStatistics from "@/components/statistics/focus-statistics";
import PomodoroTips from "@/components/statistics/pomodoro-tips";
import { Button } from "@/components/ui/button";

export default function StatisticsPage() {
  return (
    <section className="w-full max-w-6xl py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          Back to home
        </Link>
      </Button>
      <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold">
          Focus statistics
        </h1>
        <p className="text-muted-foreground text-sm">
          Review your completed Pomodoros from the last seven days.
        </p>
      </div>
      <FocusStatistics />
      <PomodoroTips />
    </section>
  );
}
