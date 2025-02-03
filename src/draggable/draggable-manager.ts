import { EventEmitter, ShapeEventMap } from "../core/event-emitter";
import { Point } from "../primitives/point";

export abstract class Draggable extends EventEmitter<ShapeEventMap> {
  abstract isDraggable(): boolean;
  abstract isInside(point: Point): boolean;
  abstract setPosition(point: Point): void;
  abstract getPosition(): Point;
}

export class DraggableManager {
  private static shapes: Draggable[] = [];

  static registerDraggableShape(shape: Draggable) {
    this.shapes.push(shape);
  }

  static getDraggableShapes(): Draggable[] {
    return this.shapes;
  }
}
