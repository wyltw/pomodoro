import type { NextRequest } from "next/server";

import { getSession } from "@/lib/dal";
import { getFocusStatisticsSessions } from "@/lib/data/pomodoro-session-queries";
import { timeZoneSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Please sign in to view focus statistics." },
        { status: 401 },
      );
    }

    const timeZone = timeZoneSchema.safeParse(
      request.nextUrl.searchParams.get("timeZone"),
    );

    if (!timeZone.success) {
      return Response.json(
        { error: "The time zone is invalid." },
        { status: 400 },
      );
    }

    const sessions = await getFocusStatisticsSessions(
      session.user.id,
      timeZone.data,
    );

    return Response.json({ data: sessions });
  } catch (error) {
    console.error("Unable to load focus statistics", error);
    return Response.json(
      { error: "Unable to load focus statistics right now." },
      { status: 500 },
    );
  }
}
