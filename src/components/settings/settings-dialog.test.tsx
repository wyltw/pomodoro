import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";

import { SettingsDialog } from "@/components/settings/settings-dialog";
import {
  defaultTimerSettings,
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

beforeEach(() => {
  useTimerSettingsStore.setState(defaultTimerSettings);
});

describe("SettingsDialog", () => {
  test("saves the Pomodoro length and notification volume", async () => {
    const user = userEvent.setup();

    render(
      <>
        <SettingsDialog />
        <CurrentSettings />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoroMinutesInput = screen.getByRole("spinbutton");
    const notificationVolumeSlider = screen.getByRole("slider", {
      name: "Notification volume",
    });

    await user.clear(pomodoroMinutesInput);
    await user.type(pomodoroMinutesInput, "30");
    notificationVolumeSlider.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("30 minutes at 36% volume")).toBeDefined();
  });

  test("shows an error and preserves settings after invalid submission", async () => {
    const user = userEvent.setup();

    render(
      <>
        <SettingsDialog />
        <CurrentSettings />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Settings" }));
    await user.clear(screen.getByRole("spinbutton"));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByText("Pomodoro length must be at least 1 minute."),
    ).toBeDefined();
    expect(screen.getByText("25 minutes at 35% volume")).toBeDefined();
  });

  test("discards unsaved changes when reopened", async () => {
    const user = userEvent.setup();

    render(<SettingsDialog />);

    await user.click(screen.getByRole("button", { name: "Settings" }));

    const pomodoroMinutesInput =
      screen.getByRole<HTMLInputElement>("spinbutton");
    const notificationVolumeSlider = screen.getByRole("slider", {
      name: "Notification volume",
    });

    await user.clear(pomodoroMinutesInput);
    await user.type(pomodoroMinutesInput, "30");
    notificationVolumeSlider.focus();
    await user.keyboard("{ArrowRight}");

    expect(pomodoroMinutesInput.value).toBe("30");
    expect(notificationVolumeSlider.getAttribute("aria-valuenow")).toBe("36");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("25");
    expect(
      screen
        .getByRole("slider", { name: "Notification volume" })
        .getAttribute("aria-valuenow"),
    ).toBe("35");
  });
});
