import { getSession } from "@/lib/dal";
import { getCompletedPomodoros } from "@/lib/data/pomodoro-session-queries";
import { timeZoneSchema } from "@/lib/schemas";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Please sign in to load completed Pomodoros." },
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

    const completedPomodoros = await getCompletedPomodoros(
      session.user.id,
      timeZone.data,
    );

    return Response.json({ data: { completedPomodoros } });
  } catch (error) {
    console.error("Unable to load completed Pomodoros", error);
    return Response.json(
      { error: "Unable to load completed Pomodoros right now." },
      { status: 500 },
    );
  }
}
