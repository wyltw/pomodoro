import dayjs from "dayjs";
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { FocusStatisticsSession } from "@/lib/types/types";

type TaskPomodoroData = {
  key: string;
  minutes: number;
  title: string;
};

type TaskPomodoroChartProps = {
  date: string | undefined;
  sessions: FocusStatisticsSession[];
};

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

function createTaskPomodoroData(
  sessions: FocusStatisticsSession[],
): TaskPomodoroData[] {
  const durationSecondsByTaskTitle = new Map<string, number>();

  for (const session of sessions) {
    const taskTitle = session.taskTitleSnapshot ?? "No task";
    const currentDurationSeconds =
      durationSecondsByTaskTitle.get(taskTitle) ?? 0;

    durationSecondsByTaskTitle.set(
      taskTitle,
      currentDurationSeconds + session.durationSeconds,
    );
  }

  return Array.from(
    durationSecondsByTaskTitle,
    ([taskTitle, totalDurationSeconds], index) => ({
      key: `task${index}`,
      minutes: totalDurationSeconds / 60,
      title: taskTitle,
    }),
  );
}

export default function TaskPomodoroChart({
  date,
  sessions,
}: TaskPomodoroChartProps) {
  const tasks = createTaskPomodoroData(sessions);
  const config: ChartConfig = Object.fromEntries(
    tasks.map((task, index) => [
      task.key,
      {
        label: task.title,
        color: chartColors[index % chartColors.length],
      },
    ]),
  );
  const data = [
    Object.fromEntries(tasks.map((task) => [task.key, task.minutes])),
  ];
  const totalMinutes = tasks.reduce((total, task) => total + task.minutes, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Task distribution</CardTitle>
        <CardDescription>
          {date ? dayjs(date).format("MMMM D, YYYY") : "Select a day"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No Pomodoros completed on this day.
          </p>
        ) : (
          <ChartContainer
            config={config}
            className="mx-auto aspect-square h-56 w-full max-w-72"
          >
            <RadialBarChart
              accessibilityLayer
              data={data}
              endAngle={180}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarAngleAxis
                axisLine={false}
                domain={[0, totalMinutes]}
                tick={false}
                tickLine={false}
                type="number"
              />
              {tasks.map((task) => (
                <RadialBar
                  key={task.key}
                  dataKey={task.key}
                  fill={`var(--color-${task.key})`}
                  stackId="tasks"
                  cornerRadius={12}
                  className="stroke-transparent stroke-2"
                />
              ))}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        transform="translate(0 12)"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalMinutes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Minutes
                        </tspan>
                      </text>
                    );
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
