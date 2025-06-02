import type { BotEvent, EventListener } from "./types"

/**
 * Simple event emitter for the Volume Bot SDK
 */
export class EventEmitter {
  private listeners: Map<string, Set<EventListener>> = new Map()

  /**
   * Add an event listener
   */
  on(eventType: string, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }

    this.listeners.get(eventType)!.add(listener)

    // Return a function to remove this listener
    return () => {
      const listeners = this.listeners.get(eventType)
      if (listeners) {
        listeners.delete(listener)
        if (listeners.size === 0) {
          this.listeners.delete(eventType)
        }
      }
    }
  }

  /**
   * Add a one-time event listener
   */
  once(eventType: string, listener: EventListener): () => void {
    const onceWrapper = (event: BotEvent) => {
      this.off(eventType, onceWrapper)
      listener(event)
    }

    return this.on(eventType, onceWrapper)
  }

  /**
   * Remove an event listener
   */
  off(eventType: string, listener: EventListener): void {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.listeners.delete(eventType)
      }
    }
  }

  /**
   * Emit an event
   */
  emit(event: BotEvent): void {
    // Emit to specific event type listeners
    const typeListeners = this.listeners.get(event.type)
    if (typeListeners) {
      typeListeners.forEach((listener) => listener(event))
    }

    // Emit to wildcard listeners
    const wildcardListeners = this.listeners.get("*")
    if (wildcardListeners) {
      wildcardListeners.forEach((listener) => listener(event))
    }

    // Emit to bot-specific listeners
    if ("botId" in event) {
      const botSpecificListeners = this.listeners.get(`bot:${event.botId}`)
      if (botSpecificListeners) {
        botSpecificListeners.forEach((listener) => listener(event))
      }
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    this.listeners.clear()
  }
}
