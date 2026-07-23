"use client";

import { useMemo, useState } from "react";

import DailyPomodoroChart, {
  type DailyPomodoroData,
} from "@/components/statistics/daily-pomodoro-chart";
import FocusStatisticsSkeleton from "@/components/statistics/focus-statistics-skeleton";
import TaskPomodoroChart from "@/components/statistics/task-pomodoro-chart";
import { Card, CardContent } from "@/components/ui/card";
import { useFocusStatistics } from "@/lib/hooks/focus-statistics-hooks";
import type { FocusStatisticsSession } from "@/lib/types/types";
import { getLastSevenDays, getLocalDateFromTimeZone } from "@/lib/utils/utils";

function createDailyPomodoroData(
  sessions: FocusStatisticsSession[],
): DailyPomodoroData[] {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = getLocalDateFromTimeZone(timeZone);

  return getLastSevenDays(localDate, timeZone).map((date) => ({
    date,
    sessions: sessions.filter((session) => session.localDate === date).length,
  }));
}

export default function FocusStatistics() {
  const { sessions, error, isLoading } = useFocusStatistics();
  const [selectedDate, setSelectedDate] = useState<string>();
  const dailyData = useMemo(
    () => (sessions ? createDailyPomodoroData(sessions) : []),
    [sessions],
  );
  const activeDate =
    dailyData.find((day) => day.date === selectedDate)?.date ??
    dailyData[dailyData.length - 1]?.date;
  const selectedSessions = useMemo(
    () => sessions?.filter((session) => session.localDate === activeDate) ?? [],
    [activeDate, sessions],
  );

  if (isLoading) return <FocusStatisticsSkeleton />;

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <DailyPomodoroChart
        data={dailyData}
        selectedDate={activeDate}
        onDateSelect={setSelectedDate}
      />
      <TaskPomodoroChart date={activeDate} sessions={selectedSessions} />
    </div>
  );
}
