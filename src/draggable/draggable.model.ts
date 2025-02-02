import { Point } from "../primitives/point";
import { ShapeEvent } from "../core/event-emitter";

export interface Draggable {
  isDraggable(): boolean;
  emit(eventName: ShapeEvent, point: Point): void;
  isInside(point: Point): boolean;
  setPosition(point: Point): void;
  getPosition(): Point;
}
