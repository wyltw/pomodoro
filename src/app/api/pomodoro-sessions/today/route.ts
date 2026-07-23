import { getSession } from "@/lib/dal";
import { getTodayPomodoroSessionCount } from "@/lib/data/pomodoro-session-queries";
import { timeZoneSchema } from "@/lib/schemas";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Please sign in to load today's Pomodoro count." },
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

    const count = await getTodayPomodoroSessionCount(
      session.user.id,
      timeZone.data,
    );

    return Response.json({ data: { count } });
  } catch (error) {
    console.error("Unable to load today's Pomodoro count", error);
    return Response.json(
      { error: "Unable to load today's Pomodoro count right now." },
      { status: 500 },
    );
  }
}
