import { Layer } from "../../core/layer";
import { ViewPort } from "../../viewport";
import { Shape } from "./shape";

type CircleConfig = {
  x: number;
  y: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
};

export class Circle implements Shape {
  constructor(private readonly config: CircleConfig) {}

  public draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    context.beginPath();
    context.arc(
      this.config.x,
      this.config.y,
      this.config.radius,
      0,
      2 * Math.PI
    );
    context.fillStyle = this.config.fill;
    context.strokeStyle = this.config.stroke;
    context.lineWidth = this.config.strokeWidth;
    context.fill();
    context.stroke();
    context.closePath();
  }

  public remove(layer: Layer): void {
    layer.remove(this);
  }
}
