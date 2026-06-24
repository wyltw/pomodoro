import { TimerType } from "./types/types";

type TimerTabItems = {
  value: TimerType;
  label: string;
};

export const TIMER_TAB_ITEMS: TimerTabItems[] = [
  {
    value: "pomodoro",
    label: "Pomodoro",
  },
  {
    value: "shortBreak",
    label: "Short Break",
  },
  {
    value: "longBreak",
    label: "Long Break",
  },
];

export const DAILY_FOCUS_TASKS_STORAGE_KEY = "daily-focus-tasks";
