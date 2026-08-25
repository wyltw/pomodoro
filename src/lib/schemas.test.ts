import { describe, expect, test } from "vitest";

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
  test.each([Number.NaN, -0.01, 1.01])(
    "rejects an invalid notification volume: %s",
    (notificationVolume) => {
      const result = timerSettingsSchema.safeParse({
        pomodoroMinutes: 25,
        notificationVolume,
      });

      expect(result.error?.flatten().fieldErrors.notificationVolume).toEqual([
        "Notification volume is invalid.",
      ]);
    },
  );
});
