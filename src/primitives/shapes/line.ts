import { ViewPort } from "../../viewport";
import { Point } from "../point";
import { Shape } from "./shape";

type LineConfig = {
  points: Point[];
  stroke: string;
  strokeWidth: number;
  lineJoin: CanvasLineJoin;
};

export class Line extends Shape {
  constructor(private readonly config: LineConfig) {
    super();
  }

  public draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    const { points, stroke, strokeWidth, lineJoin } = this.config;

    if (points.length < 2) {
      return;
    }

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.strokeStyle = stroke;
    context.lineWidth = strokeWidth;
    context.lineJoin = lineJoin;

    context.stroke();
    context.closePath();
  }
}
