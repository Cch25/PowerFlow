import { Shape } from "./shape";


export class ShapeManager {
  private static shapes: Shape[] = [];

  static registerShape(shape: Shape) {
    this.shapes.push(shape);
  }

  static getShapes(): Shape[] {
    return this.shapes;
  }
}
