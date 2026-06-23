export type TimerType = "pomodoro" | "shortBreak" | "longBreak";

export type FocusTask = {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
};
