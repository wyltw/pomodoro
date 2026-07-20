import { describe, expect, test } from "vitest";

import { completePomodoroPayloadSchema, timeZoneSchema } from "@/lib/schemas";

describe("timeZoneSchema", () => {
  test("accepts and trims a valid IANA time zone", () => {
    expect(timeZoneSchema.parse(" Asia/Taipei ")).toBe("Asia/Taipei");
  });

  test("rejects an invalid time zone", () => {
    expect(timeZoneSchema.safeParse("Mars/Olympus").success).toBe(false);
  });
});

describe("completePomodoroPayloadSchema", () => {
  test("accepts a time zone without a focus task", () => {
    expect(
      completePomodoroPayloadSchema.parse({ timeZone: "Asia/Taipei" }),
    ).toEqual({ timeZone: "Asia/Taipei" });
  });

  test("rejects an invalid focus task ID", () => {
    expect(
      completePomodoroPayloadSchema.safeParse({
        taskId: "not-a-uuid",
        timeZone: "Asia/Taipei",
      }).success,
    ).toBe(false);
  });
});
