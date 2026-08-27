"use client";

import { useState, type SubmitEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { timerSettingsSchema } from "@/lib/schemas";
import type { TimerSettings } from "@/lib/stores/timer-settings-store";

type SettingsFormProps = {
  initialSettings: TimerSettings;
  onSubmit: (settings: TimerSettings) => void;
};

export function SettingsForm({ initialSettings, onSubmit }: SettingsFormProps) {
  const [pomodoroMinutesInput, setPomodoroMinutesInput] = useState(
    String(initialSettings.pomodoroMinutes),
  );
  const [notificationVolumePercent, setNotificationVolumePercent] = useState(
    initialSettings.notificationVolume * 100,
  );
  const [error, setError] = useState<{
    pomodoroMinutes?: string[] | undefined;
    notificationVolume?: string[] | undefined;
  }>();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const settings = timerSettingsSchema.safeParse({
      pomodoroMinutes: Number(pomodoroMinutesInput),
      notificationVolume: notificationVolumePercent / 100,
    });

    if (!settings.success) {
      setError(z.flattenError(settings.error).fieldErrors);
      return;
    }

    onSubmit(settings.data);
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Timer settings</DialogTitle>
        <DialogDescription>
          Adjust your Pomodoro length and notification volume.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="pomodoro-minutes">Pomodoro length</FieldLabel>
        <Input
          id="pomodoro-minutes"
          inputMode="numeric"
          onChange={(event) => {
            setPomodoroMinutesInput(event.currentTarget.value);
            setError(undefined);
          }}
          step={1}
          type="number"
          value={pomodoroMinutesInput}
        />
        {error?.pomodoroMinutes ? (
          <FieldError>{error.pomodoroMinutes[0]}</FieldError>
        ) : (
          <FieldDescription>Between 1 and 60 minutes.</FieldDescription>
        )}
      </Field>

      <Field>
        <div className="flex items-center justify-between gap-4">
          <FieldLabel htmlFor="notification-volume">
            Notification volume
          </FieldLabel>
          <span className="text-muted-foreground text-sm tabular-nums">
            {notificationVolumePercent}%
          </span>
        </div>
        <Slider
          aria-label="Notification volume"
          id="notification-volume"
          onValueChange={(value) => {
            setNotificationVolumePercent(value[0] ?? 0);
            setError(undefined);
          }}
          step={1}
          value={[notificationVolumePercent]}
        />
        <FieldError>{error?.notificationVolume?.[0] ?? ""}</FieldError>
      </Field>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}
