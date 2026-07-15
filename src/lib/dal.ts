import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

export const getSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
);

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return {
    userId: session.user.id,
  };
});
