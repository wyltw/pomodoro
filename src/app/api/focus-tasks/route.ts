import type { NextRequest } from "next/server";

import { getSession } from "@/lib/dal";
import { getFocusTasks } from "@/lib/data/tasks-queries";
import { localDateSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Please sign in to load your focus tasks." },
        { status: 401 },
      );
    }

    const localDate = localDateSchema.safeParse(
      request.nextUrl.searchParams.get("localDate"),
    );

    if (!localDate.success) {
      return Response.json(
        { error: "The local date is invalid." },
        { status: 400 },
      );
    }

    const tasks = await getFocusTasks(localDate.data);

    return Response.json({ data: tasks });
  } catch (error) {
    console.error("Unable to load focus tasks", error);
    return Response.json(
      { error: "Unable to load focus tasks right now." },
      { status: 500 },
    );
  }
}
