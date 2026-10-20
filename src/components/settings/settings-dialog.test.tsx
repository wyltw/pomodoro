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

    const settingsButton = screen.getByRole("button", { name: "Settings" });
    await user.click(settingsButton);

    const pomodoroMinutesInput = screen.getByRole("spinbutton");
    const notificationVolumeSlider = screen.getByRole("slider", {
      name: "Notification volume",
    });
    const saveChangesButton = screen.getByRole("button", {
      name: "Save changes",
    });

    await user.clear(pomodoroMinutesInput);
    await user.type(pomodoroMinutesInput, "30");
    notificationVolumeSlider.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(saveChangesButton);

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

    const settingsButton = screen.getByRole("button", { name: "Settings" });
    await user.click(settingsButton);

    const pomodoroMinutesInput = screen.getByRole("spinbutton");
    const saveChangesButton = screen.getByRole("button", {
      name: "Save changes",
    });
    await user.clear(pomodoroMinutesInput);
    await user.click(saveChangesButton);

    expect(
      screen.getByText("Pomodoro length must be at least 1 minute."),
    ).toBeDefined();
    expect(screen.getByText("25 minutes at 35% volume")).toBeDefined();
  });

  test("discards unsaved changes when reopened", async () => {
    const user = userEvent.setup();

    render(<SettingsDialog />);

    const settingsButton = screen.getByRole("button", { name: "Settings" });
    await user.click(settingsButton);

    const pomodoroMinutesInput =
      screen.getByRole<HTMLInputElement>("spinbutton");
    const notificationVolumeSlider = screen.getByRole("slider", {
      name: "Notification volume",
    });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await user.clear(pomodoroMinutesInput);
    await user.type(pomodoroMinutesInput, "30");
    notificationVolumeSlider.focus();
    await user.keyboard("{ArrowRight}");

    expect(pomodoroMinutesInput.value).toBe("30");
    expect(notificationVolumeSlider.getAttribute("aria-valuenow")).toBe("36");

    await user.click(cancelButton);
    await user.click(settingsButton);

    const reopenedPomodoroMinutesInput =
      screen.getByRole<HTMLInputElement>("spinbutton");
    const reopenedNotificationVolumeSlider = screen.getByRole("slider", {
      name: "Notification volume",
    });
    expect(reopenedPomodoroMinutesInput.value).toBe("25");
    expect(reopenedNotificationVolumeSlider.getAttribute("aria-valuenow")).toBe(
      "35",
    );
  });
});
