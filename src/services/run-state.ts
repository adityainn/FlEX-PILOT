import { eventBus } from "./event-bus";

export type RunState =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed";

export interface RunStateMetadata {
  runId: string;
  status: RunState;
  currentAgent?: string;
  currentChapter?: number;
  currentStep?: string;
  startedAt?: number;
  updatedAt?: number;
}

class RunStateManager {
  private states: Record<string, RunStateMetadata> = {};

  get(runId: string): RunStateMetadata {
    if (!this.states[runId]) {
      this.states[runId] = {
        runId,
        status: "idle",
        startedAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    return this.states[runId];
  }

  set(runId: string, updates: Partial<RunStateMetadata>) {
    const currentState = this.get(runId);
    this.states[runId] = {
      ...currentState,
      ...updates,
      updatedAt: Date.now(),
    };
  }

  async waitUntilRunning(runId: string): Promise<void> {
    while (this.get(runId).status === 'paused') {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (this.get(runId).status === 'cancelled') {
      throw new Error(`Run ${runId} was cancelled.`);
    }
  }

  updateProgress(runId: string, chapter: number, agent: string, step: string) {
    this.set(runId, {
      currentChapter: chapter,
      currentAgent: agent,
      currentStep: step
    });

    eventBus.emit({
      type: 'RUN_CHAPTER_CHANGED',
      payload: { runId, chapter, agent, step }
    });
  }

  pause(runId: string) {
    this.set(runId, { status: 'paused' });
    eventBus.emit({ type: 'RUN_PAUSED', payload: { runId } });
  }

  resume(runId: string) {
    this.set(runId, { status: 'running' });
    eventBus.emit({ type: 'RUN_RESUMED', payload: { runId } });
  }

  cancel(runId: string) {
    this.set(runId, { status: 'cancelled' });
    eventBus.emit({ type: 'RUN_CANCELLED', payload: { runId } });
  }
}

const globalForRunState = globalThis as unknown as { runStateManager: RunStateManager };
export const runStateManager = globalForRunState.runStateManager || new RunStateManager();
if (process.env.NODE_ENV !== "production") globalForRunState.runStateManager = runStateManager;
