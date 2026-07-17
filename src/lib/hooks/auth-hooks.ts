"use client";

import { authClient } from "@/lib/auth-client";

export function useAuthSession() {
  const { data: session, isPending } = authClient.useSession();

  return {
    session,
    isPending,
    isSignedIn: Boolean(session),
  };
}
