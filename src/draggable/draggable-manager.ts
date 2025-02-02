import { Draggable } from "./draggable.model";

export class DraggableManager {
  private static shapes: Draggable[] = [];

  static registerDraggableShape(shape: Draggable) {
    this.shapes.push(shape);
  }

  static getDraggableShapes(): Draggable[] {
    return this.shapes;
  }
}
