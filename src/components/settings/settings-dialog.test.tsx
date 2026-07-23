import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { SettingsDialog } from "@/components/settings/settings-dialog";
import {
  TimerSettingsProvider,
  useTimerSettingsStore,
} from "@/lib/stores/timer-settings-store";

function CurrentSettings() {
  const pomodoroMinutes = useTimerSettingsStore(
    (state) => state.pomodoroMinutes,
  );
  const notificationVolume = useTimerSettingsStore(
    (state) => state.notificationVolume,
  );

  return (
    <output>
      {pomodoroMinutes} minutes at {notificationVolume * 100}% volume
    </output>
  );
}

describe("SettingsDialog", () => {
  test("saves the Pomodoro length and notification volume", () => {
    render(
      <TimerSettingsProvider>
        <SettingsDialog />
        <CurrentSettings />
      </TimerSettingsProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "30" },
    });
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Notification volume" }),
      { key: "ArrowRight" },
    );
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("30 minutes at 36% volume")).toBeDefined();
  });
});
