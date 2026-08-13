import { SwarmEvent } from "@/types";

type EventCallback = (event: SwarmEvent) => void;

class EventBus {
  private listeners: Set<EventCallback> = new Set();

  subscribe(callback: EventCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(event: SwarmEvent) {
    // Dispatch to all subscribers asynchronously to avoid blocking the agent loop
    setTimeout(() => {
      this.listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error("EventBus listener error:", e);
        }
      });
    }, 0);
  }
}

const globalForEventBus = globalThis as unknown as { eventBus: EventBus };
export const eventBus = globalForEventBus.eventBus || new EventBus();
if (process.env.NODE_ENV !== "production") globalForEventBus.eventBus = eventBus;
