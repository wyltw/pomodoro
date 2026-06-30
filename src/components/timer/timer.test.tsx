import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Timer from "./timer";

describe("Timer", () => {
  test("calls onComplete once when the timer completes", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(<Timer sessionMax={1} sessionMin={0} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: "start timer" }));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledOnce();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
