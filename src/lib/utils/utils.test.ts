import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { retry } from "./utils";

describe("retry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  test("calls the action once plus all retries when every result is retryable", async () => {
    const mockAction = vi.fn().mockResolvedValue(false);
    retry({
      action: mockAction,
      shouldRetry: (result) => !result,
      retries: 3,
    });
    await vi.runAllTimersAsync();

    expect(mockAction).toHaveBeenCalledTimes(4);
  });

  test("returns early when success", async () => {
    const mockAction = vi.fn().mockResolvedValue(true);

    const retryPromise = retry({
      action: mockAction,
      shouldRetry: (result) => !result,
      retries: 3,
    });
    await vi.runAllTimersAsync();

    await expect(retryPromise).resolves.toBe(true);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  test("returns false after exhausting all retries", async () => {
    const mockAction = vi.fn().mockResolvedValue(false);

    const retryPromise = retry({
      action: mockAction,
      shouldRetry: (result) => !result,
      retries: 3,
    });
    await vi.runAllTimersAsync();

    await expect(retryPromise).resolves.toBe(false);
  });
});
