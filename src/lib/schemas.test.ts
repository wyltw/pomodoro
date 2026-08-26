import { describe, expect, test } from "vitest";
import { z } from "zod";

import {
  completePomodoroPayloadSchema,
  timerSettingsSchema,
  timeZoneSchema,
} from "@/lib/schemas";

describe("timeZoneSchema", () => {
  test("accepts a valid IANA time zone", () => {
    expect(timeZoneSchema.parse("Asia/Taipei")).toBe("Asia/Taipei");
  });

  test("rejects an invalid time zone", () => {
    expect(timeZoneSchema.safeParse("Mars/Olympus").success).toBe(false);
  });
});

describe("completePomodoroPayloadSchema", () => {
  test("accepts a time zone without a focus task", () => {
    expect(
      completePomodoroPayloadSchema.parse({
        durationSeconds: 1500,
        timeZone: "Asia/Taipei",
      }),
    ).toEqual({ durationSeconds: 1500, timeZone: "Asia/Taipei" });
  });

  test("rejects an invalid focus task ID", () => {
    expect(
      completePomodoroPayloadSchema.safeParse({
        durationSeconds: 1500,
        taskId: "not-a-uuid",
        timeZone: "Asia/Taipei",
      }).success,
    ).toBe(false);
  });
});

describe("timerSettingsSchema", () => {
  test.each([1, 60])(
    "accepts a valid Pomodoro length: %s",
    (pomodoroMinutes) => {
      expect(
        timerSettingsSchema.safeParse({
          pomodoroMinutes,
          notificationVolume: 0.5,
        }).success,
      ).toBe(true);
    },
  );

  test.each([
    [Number.NaN, "Pomodoro length is required."],
    [1.5, "Pomodoro length must be a whole number of minutes."],
    [0, "Pomodoro length must be at least 1 minute."],
    [61, "Pomodoro length cannot exceed 60 minutes."],
  ])(
    "rejects an invalid Pomodoro length: %s",
    (pomodoroMinutes, expectedError) => {
      const result = timerSettingsSchema.safeParse({
        pomodoroMinutes,
        notificationVolume: 0.5,
      });

      expect(
        result.error &&
          z.flattenError(result.error).fieldErrors.pomodoroMinutes,
      ).toEqual([expectedError]);
    },
  );

  test.each([Number.NaN, -0.01, 1.01])(
    "rejects an invalid notification volume: %s",
    (notificationVolume) => {
      const result = timerSettingsSchema.safeParse({
        pomodoroMinutes: 25,
        notificationVolume,
      });

      expect(
        result.error &&
          z.flattenError(result.error).fieldErrors.notificationVolume,
      ).toEqual(["Notification volume is invalid."]);
    },
  );
});
