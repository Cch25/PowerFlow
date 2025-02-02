import { Point } from "../point"; 
import { ShapeEvent } from "./event-emitter";

export interface Shape {
  draw(): void;
  isDraggable(): boolean;
  isInside(point: Point): boolean;
  setPosition(point: Point): void;
  getPosition(): Point;
  emit(eventName: ShapeEvent, point: Point): void;
}
