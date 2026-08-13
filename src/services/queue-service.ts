import { swarmOrchestrator } from './orchestrator';

export interface JobData {
  runId: string;
  repositoryUrl: string;
  branchId: string;
}

class QueueService {
  public async enqueueRun(repositoryUrl: string, branchId: string): Promise<string> {
    const runId = Math.random().toString(36).substring(7);
    
    // Start processing in the background immediately without queue blocking
    console.log(`[Queue] Starting background job for run ${runId}`);
    swarmOrchestrator.startRun(repositoryUrl, branchId, runId).catch((error) => {
      console.error(`[Queue] Job failed for run ${runId}:`, error);
    });
    
    return runId;
  }
}

export const queueService = new QueueService();
