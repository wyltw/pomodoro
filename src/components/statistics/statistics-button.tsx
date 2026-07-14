"use client";

import { ChartColumn } from "lucide-react";
import Link from "next/link";

import { LoginDialog } from "@/components/auth/login-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function StatisticsButton() {
  const { data: session, isPending } = authClient.useSession();
  const isSignedIn = session !== null;

  if (isPending)
    return (
      <Button variant="ghost" size="lg" disabled aria-busy="true">
        <ChartColumn data-icon="inline-start" />
        Statistics
      </Button>
    );

  if (!isSignedIn)
    return (
      <LoginDialog from="statistics">
        <Button variant="ghost" size="lg">
          <ChartColumn data-icon="inline-start" />
          Statistics
        </Button>
      </LoginDialog>
    );
  return (
    <Button variant="ghost" size="lg" asChild>
      <Link href="/statistics" className="flex items-center gap-1.5">
        <ChartColumn data-icon="inline-start" />
        Statistics
      </Link>
    </Button>
  );
}
