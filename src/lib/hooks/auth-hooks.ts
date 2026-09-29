"use client";

import { useSyncExternalStore } from "react";

import { authClient } from "@/lib/auth-client";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function useAuthSession() {
  const { data: session, isPending } = authClient.useSession();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const hydratedSession = isHydrated ? session : null;

  return {
    session: hydratedSession,
    isPending: !isHydrated || isPending,
    isSignedIn: Boolean(hydratedSession),
  };
}
