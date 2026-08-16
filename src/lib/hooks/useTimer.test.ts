import { act, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { TimerStatusProvider } from "@/lib/contexts/timer-status-context";
import { useTimer } from "./useTimer";

function TimerStatusWrapper({ children }: { children: ReactNode }) {
  return createElement(TimerStatusProvider, null, children);
}

const setupUseTimer = (initialSeconds = 0, endSeconds = 10) =>
  renderHook(
    ({ initialSeconds, endSeconds }) => useTimer(initialSeconds, endSeconds),
    {
      initialProps: { initialSeconds, endSeconds },
      wrapper: TimerStatusWrapper,
    },
  );

describe("useTimer", () => {
  test("should start with initial seconds", () => {
    const { result } = setupUseTimer();

    expect(result.current.seconds).toBe(0);
  });

  test("should update the end while idle", () => {
    const { result, rerender } = setupUseTimer();

    rerender({ initialSeconds: 0, endSeconds: 20 });

    expect(result.current.endSeconds).toBe(20);
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

  test("should keep the current end after pausing and resuming", () => {
    vi.useFakeTimers();
    const { result, rerender } = setupUseTimer(0, 3);

    act(() => result.current.startTimer());
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => result.current.pauseTimer());

    rerender({ initialSeconds: 0, endSeconds: 10 });

    expect(result.current.endSeconds).toBe(3);

    act(() => result.current.startTimer());
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.status).toBe("completed");
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

  test("should complete and reset after reaching the end", () => {
    vi.useFakeTimers();
    const { result } = setupUseTimer(0, 1);

    act(() => result.current.startTimer());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.status).toBe("completed");
  });

  test("should keep the session end while completed", () => {
    vi.useFakeTimers();
    const { result, rerender } = setupUseTimer(0, 1);

    act(() => result.current.startTimer());
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    rerender({ initialSeconds: 0, endSeconds: 10 });

    expect(result.current.endSeconds).toBe(1);
  });
});
