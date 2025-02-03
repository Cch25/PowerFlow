import { EventEmitter, ShapeEventMap } from "../core/event-emitter";
import { Point } from "../primitives/point";

export abstract class Draggable  extends EventEmitter<ShapeEventMap> {
  abstract isDraggable(): boolean;
  abstract isInside(point: Point): boolean;
  abstract setPosition(point: Point): void;
  abstract getPosition(): Point;
}
