import { Point } from "../primitives/point";
import { ShapeConfig } from "../primitives/shapes/shape";

export interface ShapeEventMap
  extends Record<string, (...args: any[]) => void> {
  dragmove: (point: ShapeConfig) => void;
}

export class EventEmitter<
  EventMap extends Record<string, (...args: any[]) => void>
> {
  private events: Partial<{ [K in keyof EventMap]: EventMap[K][] }> = {};

  public on<K extends keyof EventMap>(
    eventName: K,
    callback: EventMap[K]
  ): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]!.push(callback);
  }

  public emit<K extends keyof EventMap>(
    eventName: K,
    ...args: Parameters<EventMap[K]>
  ): void {
    this.events[eventName]?.forEach((callback) => callback(...args));
  }

  // off method to remove a callback for an event
  public off<K extends keyof EventMap>(
    eventName: K,
    callback: EventMap[K]
  ): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName]!.filter(
        (cb) => cb !== callback
      );
    }
  }
}
