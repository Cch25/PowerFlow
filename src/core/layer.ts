import { Circle } from "../primitives/shapes/circle";
import { Line } from "../primitives/shapes/line";
import { Shape } from "../primitives/shapes/shape";
import { ViewPort } from "../viewport";

export class Layer {
  private shapes: Shape[] = [];

  public add(shape: Shape) {
    this.shapes.push(shape);
  }

  public remove(shape: Shape) {
    this.shapes = this.shapes.filter(s => s !== shape);
  }

  public draw(viewPort: ViewPort) {
    this.shapes.forEach((shape) => shape.draw(viewPort));
  }
}
