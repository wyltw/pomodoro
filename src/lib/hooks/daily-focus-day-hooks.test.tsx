import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { getOrCreateDailyFocusDay } from "@/lib/actions/daily-focus-day-actions";
import { focusTasksQueryKey } from "@/lib/hooks/focus-task-hooks";
import { useInitializeDailyFocusDay } from "./daily-focus-day-hooks";

vi.mock("@/lib/actions/daily-focus-day-actions", () => ({
  getOrCreateDailyFocusDay: vi.fn(),
}));

vi.mock("@/lib/hooks/focus-task-hooks", () => ({
  focusTasksQueryKey: (localDate: string) => ["focus-tasks", localDate],
}));

vi.mock("@/lib/utils/utils", () => ({
  getLocalDateKey: () => "2026-07-18",
}));

function createWrapper(queryClient: QueryClient) {
  return function QueryClientWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useInitializeDailyFocusDay", () => {
  beforeEach(() => {
    vi.mocked(getOrCreateDailyFocusDay).mockReset();
  });

  test("does not initialize a daily focus day without a user", () => {
    const queryClient = new QueryClient();

    renderHook(() => useInitializeDailyFocusDay(undefined), {
      wrapper: createWrapper(queryClient),
    });

    expect(getOrCreateDailyFocusDay).not.toHaveBeenCalled();
  });

  test("initializes the daily focus day and invalidates its tasks", async () => {
    const queryClient = new QueryClient();
    const invalidateQueries = vi
      .spyOn(queryClient, "invalidateQueries")
      .mockResolvedValue();

    renderHook(() => useInitializeDailyFocusDay("user-1"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(getOrCreateDailyFocusDay).toHaveBeenCalledWith(
        "2026-07-18",
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: focusTasksQueryKey("2026-07-18"),
      });
    });
  });

  test("initializes again when the user changes", async () => {
    const queryClient = new QueryClient();
    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue();
    const { rerender } = renderHook(
      ({ userId }) => useInitializeDailyFocusDay(userId),
      {
        initialProps: { userId: "user-1" },
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => {
      expect(getOrCreateDailyFocusDay).toHaveBeenCalledTimes(1);
    });

    rerender({ userId: "user-2" });

    await waitFor(() => {
      expect(getOrCreateDailyFocusDay).toHaveBeenCalledTimes(2);
    });
  });
});
