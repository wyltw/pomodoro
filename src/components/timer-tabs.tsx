import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./timer";
import { TIMER_TAB_ITEMS } from "@/lib/constants";

export default function TimerTabs() {
  return (
    <Tabs defaultValue="pomodoro" className="w-full max-w-sm">
      <TabsList>
        {TIMER_TAB_ITEMS.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="pomodoro">
        <Timer sessionMax={1500} sessionMin={0} />
      </TabsContent>
      <TabsContent value="shortBreak">
        <Timer sessionMax={300} sessionMin={0} />
      </TabsContent>
      <TabsContent value="longBreak">
        <Timer sessionMax={900} sessionMin={0} />
      </TabsContent>
    </Tabs>
  );
}
