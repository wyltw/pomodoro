"use client";

import { useQuery } from "@tanstack/react-query";

import { getFocusStatistics } from "@/lib/api/focus-statistics";

export const focusStatisticsQueryKey = ["focus-statistics"] as const;

export function useFocusStatistics() {
  const {
    data: sessions,
    error,
    isLoading,
  } = useQuery({
    queryFn: getFocusStatistics,
    queryKey: focusStatisticsQueryKey,
    retry: false,
  });

  return { sessions, error, isLoading };
}
