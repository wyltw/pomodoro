"use client";

import { useSyncExternalStore } from "react";

import { authClient } from "@/lib/auth-client";

function subscribeToHydration() {
  return () => {};
}

function getClientHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

export function useAuthSession() {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const { data: clientSession, isPending: isClientSessionPending } =
    authClient.useSession();
  const session = isHydrated ? clientSession : null;
  const isPending = !isHydrated || isClientSessionPending;

  return {
    session,
    isPending,
    isSignedIn: Boolean(session),
  };
}
