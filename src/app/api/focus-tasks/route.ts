import type { NextRequest } from "next/server";

import { getSession } from "@/lib/dal";
import { getFocusTasks } from "@/lib/data/focus-task-queries";
import { timeZoneSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Please sign in to load your focus tasks." },
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

    const tasks = await getFocusTasks(session.user.id, timeZone.data);

    return Response.json({ data: tasks });
  } catch (error) {
    console.error("Unable to load focus tasks", error);
    return Response.json(
      { error: "Unable to load focus tasks right now." },
      { status: 500 },
    );
  }
}
