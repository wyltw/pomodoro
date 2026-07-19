import { describe, expect, test } from "vitest";

import { timeZoneSchema } from "@/lib/schemas";

describe("timeZoneSchema", () => {
  test("accepts and trims a valid IANA time zone", () => {
    expect(timeZoneSchema.parse(" Asia/Taipei ")).toBe("Asia/Taipei");
  });

  test("rejects an invalid time zone", () => {
    expect(timeZoneSchema.safeParse("Mars/Olympus").success).toBe(false);
  });
});
