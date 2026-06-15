import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timer from "./timer";
import { TIMER_TAB_ITEMS } from "@/lib/constants";
import { Card } from "./ui/card";

export default function TimerTabs() {
  return (
    <Card className="ring-0 shadow-none">
      <Tabs defaultValue="pomodoro" className="px-4 gap-4">
        <TabsList className="self-center">
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
    </Card>
  );
}
