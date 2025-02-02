import { Shape } from "./shapes/shape";
export class PfLayer {
  private readonly shapes: Shape[] = [];
  public add(shape: Shape) {
    this.shapes.push(shape);
  }

  public draw() {
    this.shapes.forEach((shape) => shape.draw());
  }
}
