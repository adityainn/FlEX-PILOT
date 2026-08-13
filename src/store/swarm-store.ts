import { create } from 'zustand';
import { AgentLog, AgentStatus, RunContext, SwarmEvent } from '@/types';

interface SwarmState {
  runContext: RunContext | null;
  agentStatuses: Record<string, AgentStatus>;
  logs: AgentLog[];
  
  startRun: (repositoryId: string, branchId: string) => void;
  pauseRun: () => void;
  resumeRun: () => void;
  cancelRun: () => void;
  reset: () => void;
}

export const useSwarmStore = create<SwarmState>((set, get) => ({
  runContext: null,
  agentStatuses: {},
  logs: [],
  
  startRun: async (repositoryId: string, branchId: string) => {
    if (get().runContext) return; // already running
    
    set({ runContext: { runId: 'pending', repositoryId, branchId, status: 'initialized', startTime: Date.now(), metrics: { initialScore: 72, finalScore: 72, issuesFound: 0, issuesFixed: 0, criticalFixed: 0 } } });

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repositoryId, branchId })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        
        buffer = lines.pop() || ""; // keep the incomplete part

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr.trim()) {
              try {
                const event = JSON.parse(dataStr) as SwarmEvent;
                
                set((state) => {
                  switch (event.type) {
                    case 'RUN_STARTED':
                      return { ...state, runContext: event.payload };
                    
                    case 'RUN_COMPLETED':
                      if (state.runContext) {
                        return { ...state, runContext: { ...state.runContext, ...event.payload, status: 'completed' } };
                      }
                      return state;
                      
                    case 'METRICS_UPDATED':
                      if (state.runContext) {
                        return {
                          ...state,
                          runContext: {
                            ...state.runContext,
                            metrics: { ...state.runContext.metrics, ...event.payload }
                          }
                        };
                      }
                      return state;

                    case 'RUN_CHAPTER_CHANGED':
                      if (state.runContext) {
                        return {
                          ...state,
                          runContext: {
                            ...state.runContext,
                            currentChapter: event.payload.chapter,
                            currentAgent: event.payload.agent,
                            currentStep: event.payload.step
                          }
                        };
                      }
                      return state;

                    case 'RUN_PAUSED':
                      if (state.runContext) {
                        return { ...state, runContext: { ...state.runContext, status: 'paused' } };
                      }
                      return state;

                    case 'RUN_RESUMED':
                      if (state.runContext) {
                        return { ...state, runContext: { ...state.runContext, status: 'running' } };
                      }
                      return state;
                      
                    case 'AGENT_STATUS_CHANGED':
                      return {
                        ...state,
                        agentStatuses: {
                          ...state.agentStatuses,
                          [event.payload.agentId]: event.payload.status
                        }
                      };
                      
                    case 'AGENT_LOG':
                      return {
                        ...state,
                        logs: [event.payload, ...state.logs]
                      };
                      
                    default:
                      return state;
                  }
                });
              } catch(e) {
                console.error("Failed to parse SSE line", e);
              }
            }
          }
        }
      }
    } catch(err) {
      console.error("SSE stream error", err);
    }
  },

  pauseRun: async () => {
    const runId = get().runContext?.runId;
    if (!runId) return;
    try {
      const res = await fetch('/api/run/control', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, action: 'pause' }) 
      });
      if (!res.ok) console.error("Pause failed", await res.text());
    } catch (e) {
      console.error("Pause fetch error", e);
    }
  },

  resumeRun: async () => {
    const runId = get().runContext?.runId;
    if (!runId) return;
    try {
      const res = await fetch('/api/run/control', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, action: 'resume' }) 
      });
      if (!res.ok) console.error("Resume failed", await res.text());
    } catch (e) {
      console.error("Resume fetch error", e);
    }
  },

  cancelRun: async () => {
    const runId = get().runContext?.runId;
    if (!runId) return;
    try {
      await fetch('/api/run/control', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId, action: 'cancel' }) 
      });
    } catch (e) {}
  },

  reset: () => set({ runContext: null, agentStatuses: {}, logs: [] })
}));
