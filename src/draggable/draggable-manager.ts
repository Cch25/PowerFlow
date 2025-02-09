import { EventEmitter, ShapeEventMap } from "../core/event-emitter";
import { Point } from "../primitives/point";
import { ShapeConfig } from "../primitives/shapes/shape";

export abstract class Draggable extends EventEmitter<ShapeEventMap> {
  abstract isDraggable(): boolean;
  abstract isInside(point: Point): boolean;
  abstract getCofig(): ShapeConfig;
  abstract setConfig(data: ShapeConfig): void;
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
