"use client";

import { ChartColumn } from "lucide-react";
import { useRouter } from "next/navigation";

import { LoginDialog } from "@/components/auth/login-dialog";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/lib/hooks/auth-hooks";

export function StatisticsButton() {
  const { isPending, isSignedIn } = useAuthSession();
  const router = useRouter();

  if (!isSignedIn) {
    return (
      <LoginDialog from="statistics">
        <Button
          aria-busy={isPending || undefined}
          aria-label="Statistics"
          className="size-9 min-[900px]:w-auto min-[900px]:px-4"
          disabled={isPending}
          variant="ghost"
        >
          <ChartColumn />
          <span className="hidden min-[900px]:inline">Statistics</span>
        </Button>
      </LoginDialog>
    );
  }

  return (
    <Button
      aria-label="Statistics"
      className="size-9 min-[900px]:w-auto min-[900px]:px-4"
      onClick={() => router.push("/statistics")}
      variant="ghost"
    >
      <ChartColumn />
      <span className="hidden min-[900px]:inline">Statistics</span>
    </Button>
  );
}
