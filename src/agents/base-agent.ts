import { AgentStatus, IAgent, LogLevel } from "@/types";
import { eventBus } from "@/services/event-bus";
import { runStateManager } from "@/services/run-state";

export abstract class BaseAgent<TInput, TOutput> implements IAgent<TInput, TOutput> {
  public status: AgentStatus = 'idle';

  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  protected setStatus(runId: string, status: AgentStatus) {
    this.status = status;
    eventBus.emit({
      type: 'AGENT_STATUS_CHANGED',
      payload: { runId, agentId: this.id, status }
    });
  }

  protected log(runId: string, message: string, level: LogLevel = 'info') {
    eventBus.emit({
      type: 'AGENT_LOG',
      payload: {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        runId,
        agentId: this.id,
        message,
        level
      }
    });
  }

  protected async delay(ms: number, runId?: string) {
    if (runId) await this.checkpoint(runId);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected async checkpoint(runId: string) {
    await runStateManager.waitUntilRunning(runId);
  }

  public async execute(runId: string, input: TInput): Promise<TOutput> {
    try {
      await this.checkpoint(runId);
      this.setStatus(runId, 'running');
      const result = await this.performTask(runId, input);
      this.setStatus(runId, 'completed');
      return result;
    } catch (err) {
      const error = err as Error;
      this.setStatus(runId, 'failed');
      this.log(runId, `Agent failed: ${error.message}`, 'error');
      throw error;
    }
  }

  protected abstract performTask(runId: string, input: TInput): Promise<TOutput>;
}
