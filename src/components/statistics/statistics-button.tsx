"use client";

import { ChartColumn } from "lucide-react";
import Link from "next/link";

import { LoginDialog } from "@/components/auth/login-dialog";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/lib/hooks/auth-hooks";

export function StatisticsButton() {
  const { isPending, isSignedIn } = useAuthSession();
  const buttonContent = (
    <>
      <ChartColumn />
      <span className="hidden min-[900px]:inline">Statistics</span>
    </>
  );

  if (isPending) {
    return (
      <Button
        aria-busy="true"
        aria-label="Statistics"
        className="size-9 min-[900px]:w-auto min-[900px]:px-4"
        disabled
        variant="ghost"
      >
        {buttonContent}
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <LoginDialog from="statistics">
        <Button
          aria-label="Statistics"
          className="size-9 min-[900px]:w-auto min-[900px]:px-4"
          variant="ghost"
        >
          {buttonContent}
        </Button>
      </LoginDialog>
    );
  }

  return (
    <Button
      aria-label="Statistics"
      asChild
      className="size-9 min-[900px]:w-auto min-[900px]:px-4"
      variant="ghost"
    >
      <Link href="/statistics">{buttonContent}</Link>
    </Button>
  );
}
