"use client";

import { SettingsIcon } from "lucide-react";
import { useState } from "react";

import { SettingsForm } from "@/components/settings/settings-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  type TimerSettings,
  useTimerSettingsStore,
} from "@/lib/stores/timer-settings-store";

export function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const pomodoroMinutes = useTimerSettingsStore(
    (state) => state.pomodoroMinutes,
  );
  const notificationVolume = useTimerSettingsStore(
    (state) => state.notificationVolume,
  );
  const updateSettings = useTimerSettingsStore((state) => state.updateSettings);

  function handleDialogOpenChange(open: boolean) {
    setIsOpen(open);
  }

  function handleSettingsSubmit(settings: TimerSettings) {
    updateSettings(settings);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          aria-label="Settings"
          className="size-9 min-[900px]:w-auto min-[900px]:px-4"
          variant="ghost"
        >
          <SettingsIcon />
          <span className="hidden min-[900px]:inline">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SettingsForm
          initialSettings={{ pomodoroMinutes, notificationVolume }}
          onSubmit={handleSettingsSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
