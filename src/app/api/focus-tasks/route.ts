import type { NextRequest } from "next/server";

import { getSession } from "@/lib/dal";
import { getFocusTasks } from "@/lib/data/tasks-queries";
import { localDateSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const localDate = localDateSchema.safeParse(
    request.nextUrl.searchParams.get("localDate"),
  );

  if (!localDate.success) {
    return Response.json({ error: "Invalid localDate" }, { status: 400 });
  }

  const tasks = await getFocusTasks(localDate.data);

  return Response.json(tasks);
}
