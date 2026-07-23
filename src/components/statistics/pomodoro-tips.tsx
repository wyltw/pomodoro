import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pomodoroTips = [
  {
    question: "How long should a Pomodoro be?",
    answer:
      "Twenty-five minutes is a useful starting point, but consistency matters more than matching a fixed number. Choose a length you can protect without checking the clock, then adjust it in Settings as you learn what works for you.",
  },
  {
    question: "What should I do before starting?",
    answer:
      "Choose one task and define a small, visible finish line for the session. Close anything unrelated and keep a place nearby to capture distracting thoughts without following them.",
  },
  {
    question: "What if I get interrupted?",
    answer:
      "If the interruption can wait, make a quick note and return to the task. If you need to step away, pause the timer and resume when you can give the session your attention again.",
  },
  {
    question: "What makes a good break?",
    answer:
      "Step away from the task instead of replacing it with another demanding activity. Move around, drink water, or rest your eyes. Use a longer break after several focused rounds or whenever you need a fuller reset.",
  },
] as const;

export default function PomodoroTips() {
  return (
    <section className="mt-6">
      <div className="mb-4 space-y-1">
        <h2 className="font-heading text-xl font-semibold">Pomodoro tips</h2>
        <p className="text-muted-foreground text-sm">
          Small habits that can make each focus session more effective.
        </p>
      </div>
      <Accordion type="single" collapsible>
        {pomodoroTips.map((tip) => (
          <AccordionItem key={tip.question} value={tip.question}>
            <AccordionTrigger>{tip.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>{tip.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
