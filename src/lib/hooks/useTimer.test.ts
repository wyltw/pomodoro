import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useTimer } from "./useTimer";

const setupUseTimer = (initialSeconds = 0, endSeconds = 10) =>
  renderHook(
    ({ initialSeconds, endSeconds }) => useTimer(initialSeconds, endSeconds),
    { initialProps: { initialSeconds, endSeconds } },
  );

describe("useTimer", () => {
  test("should start with initial seconds", () => {
    const { result } = setupUseTimer();

    expect(result.current.seconds).toBe(0);
  });

  test("should start counting after startTimer", () => {
    vi.useFakeTimers();
    const { result } = setupUseTimer();

    act(() => result.current.startTimer());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(2);
  });

  test("should stop counting after pauseTimer", () => {
    vi.useFakeTimers();
    const { result } = setupUseTimer();

    act(() => result.current.startTimer());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => result.current.pauseTimer());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(2);
  });

  test("should reset seconds after stopTimer", () => {
    vi.useFakeTimers();
    const { result } = setupUseTimer();

    act(() => result.current.startTimer());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => result.current.stopTimer());

    expect(result.current.seconds).toBe(0);
  });
});
