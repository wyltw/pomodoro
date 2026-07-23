import { act, fireEvent, render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, test, vi } from "vitest";

import { TimerStatusProvider } from "@/lib/contexts/timer-status-context";
import Timer from "./timer";

describe("Timer", () => {
  test("calls onComplete once when its identity changes after completion", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const renderTimer = () => (
      <StrictMode>
        <TimerStatusProvider>
          <Timer
            sessionMax={1}
            sessionMin={0}
            onComplete={() => onComplete()}
          />
        </TimerStatusProvider>
      </StrictMode>
    );

    const { rerender } = render(renderTimer());

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledOnce();

    rerender(renderTimer());

    expect(onComplete).toHaveBeenCalledOnce();
  });

  test("reports the current session duration when the maximum changes", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const renderTimer = (sessionMax: number) => (
      <TimerStatusProvider>
        <Timer sessionMax={sessionMax} sessionMin={0} onComplete={onComplete} />
      </TimerStatusProvider>
    );
    const { rerender } = render(renderTimer(1));

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));
    rerender(renderTimer(10));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledWith(1);
  });
});
