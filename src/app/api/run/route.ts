import { NextRequest } from "next/server";
import { queueService } from "@/services/queue-service";
import { eventBus } from "@/services/event-bus";

// Force Node.js runtime for Playwright compatibility
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { repositoryId, branchId } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let unsubscribe: (() => void) | null = null;
      
      try {
        // Start the swarm, but we need the runId to filter events.
        // We'll let startRun generate the runId and return it immediately.
        // Wait, startRun is async and waits for completion.
        // We can pass an onEvent callback or just listen to all events and filter.
        
        const runId = await queueService.enqueueRun(repositoryId, branchId);
        
        unsubscribe = eventBus.subscribe((event) => {
          // Filter by runId (either on payload or inside agent log)
          const eventRunId = (event.payload as { runId?: string }).runId;
          if (eventRunId === runId || event.type === 'RUN_STARTED') {
             // Send SSE formatted event
             controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
             
             if (event.type === 'RUN_COMPLETED' && (event.payload as { runId?: string }).runId === runId) {
               controller.close();
               if (unsubscribe) unsubscribe();
             }
          }
        });

      } catch (err) {
        console.error(err);
        controller.error(err);
        if (unsubscribe) unsubscribe();
      }
    },
    cancel() {
      console.log("Client disconnected");
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
