import { Point } from "../primitives/point";

export interface Draggable {
  isDraggable(): boolean;
  emit(eventName: "dragmove", point: Point): void;
  isInside(point: Point): boolean;
  setPosition(point: Point): void;
  getPosition(): Point;
}
