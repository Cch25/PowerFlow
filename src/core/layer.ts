import { Shape } from "../primitives/shapes/shape";
import { ViewPort } from "../viewport";

export class Layer {
  private readonly shapes: Shape[] = [];
 
  public add(shape: Shape) {
    this.shapes.push(shape);
  }

  public draw(viewPort:ViewPort) {
    this.shapes.forEach((shape) => shape.draw(viewPort));
  }
}
