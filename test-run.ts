import { swarmOrchestrator } from "./src/services/orchestrator";
import { eventBus } from "./src/services/event-bus";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const runId = Math.random().toString(36).substring(7);
  
  eventBus.subscribe((event) => {
    if (event.type === 'AGENT_LOG') {
      console.log(`[${event.payload.agentId}] ${event.payload.message}`);
    }
  });

  try {
    console.log("Starting run...", runId);
    await swarmOrchestrator.startRun("https://github.com/acme/demo-react-store", "main", runId);
    console.log("Run completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Run failed:", err);
    process.exit(1);
  }
}

main();
