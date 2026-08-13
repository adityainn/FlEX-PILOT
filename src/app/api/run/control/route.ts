import { NextRequest, NextResponse } from "next/server";
import { runStateManager } from "@/services/run-state";

export async function POST(req: NextRequest) {
  try {
    const { runId, action } = await req.json();

    if (!runId || !action) {
      return NextResponse.json({ error: "Missing runId or action" }, { status: 400 });
    }

    if (action === "pause") {
      runStateManager.pause(runId);
    } else if (action === "resume") {
      runStateManager.resume(runId);
    } else if (action === "cancel") {
      runStateManager.cancel(runId);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, status: runStateManager.get(runId).status });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
