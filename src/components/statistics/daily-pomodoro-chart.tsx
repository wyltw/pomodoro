import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
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

export type DailyPomodoroData = {
  date: string;
  sessions: number;
};

type DailyPomodoroChartProps = {
  data: DailyPomodoroData[];
  selectedDate: string | undefined;
  onDateSelect: (date: string) => void;
};

const chartConfig = {
  sessions: {
    label: "Pomodoros",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DailyPomodoroChart({
  data,
  selectedDate,
  onDateSelect,
}: DailyPomodoroChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Last seven days</CardTitle>
        <CardDescription>Completed Pomodoros by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            onClick={({ activeLabel }) => {
              if (typeof activeLabel === "string") {
                onDateSelect(activeLabel);
              }
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(date: string) => dayjs(date).format("ddd")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={36}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(date) =>
                    dayjs(String(date)).format("MMM D, YYYY")
                  }
                />
              }
            />
            <Bar
              dataKey="sessions"
              fill="var(--color-sessions)"
              radius={6}
              shape={(props: BarShapeProps) => (
                <Rectangle
                  {...props}
                  className="cursor-pointer"
                  fillOpacity={
                    data[props.originalDataIndex]?.date === selectedDate
                      ? 1
                      : 0.35
                  }
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
