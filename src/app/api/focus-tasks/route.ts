import type { NextRequest } from "next/server";

import { getSession } from "@/lib/dal";
import { getFocusTasks } from "@/lib/data/tasks-queries";
import { localDateSchema } from "@/lib/schemas";
import type { FocusTasksResponse } from "@/lib/types/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      const response: FocusTasksResponse = {
        error: "Please sign in to load your focus tasks.",
      };
      return Response.json(response, { status: 401 });
    }

    const localDate = localDateSchema.safeParse(
      request.nextUrl.searchParams.get("localDate"),
    );

    if (!localDate.success) {
      const response: FocusTasksResponse = {
        error: "The local date is invalid.",
      };
      return Response.json(response, { status: 400 });
    }

    const tasks = await getFocusTasks(localDate.data);
    const response: FocusTasksResponse = { data: tasks };

    return Response.json(response);
  } catch (error) {
    console.error("Unable to load focus tasks", error);
    const response: FocusTasksResponse = {
      error: "Unable to load focus tasks right now.",
    };
    return Response.json(response, { status: 500 });
  }
}
