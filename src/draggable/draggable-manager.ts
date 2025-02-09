import { EventEmitter, ShapeEventMap } from "../core/event-emitter";
import { Point } from "../primitives/point";
import { ShapePosition } from "../primitives/shapes/shape";

export abstract class Draggable extends EventEmitter<ShapeEventMap> {
  abstract isDraggable(): boolean;
  abstract isInside(point: Point): boolean;
  abstract position(): ShapePosition;
  abstract setPosition(data: ShapePosition): void;
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
