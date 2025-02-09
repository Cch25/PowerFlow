import { Layer } from "../core/layer";
import { CorrelationLineCalculator } from "./correlation-line/correlation-line-calculator";
import { Line } from "../primitives/shapes/line";
import { Rect } from "../primitives/shapes/rect";
import { ShapeConfig } from "../primitives/shapes/shape";
import { SetUpLayer } from "./setup.layer";
import { Circle } from "../primitives/shapes/circle";

export class ShapesLayer implements SetUpLayer {
  private readonly lineCalculation = new CorrelationLineCalculator();
  private readonly layer: Layer = new Layer();

  public init(): Layer {
    const rect1 = new Rect({
      x: -250,
      y: 44,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    const rect2 = new Rect({
      x: 100,
      y: -50,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    rect1.on("dragmove", (shapeData) =>
      this.onDragMove(shapeData, rect2.getCofig())
    );
    rect2.on("dragmove", (shapeData) =>
      this.onDragMove(shapeData, rect1.getCofig())
    );

    this.line = new Line({
      lineJoin: "round",
      points: [],
      stroke: "black",
      strokeWidth: 2
    });
    this.line.update(
      this.lineCalculation.computeExpectedPoints(
        rect1.getCofig(),
        rect2.getCofig()
      )
    );

    this.layer.add(rect1);
    this.layer.add(rect2);
    this.layer.add(this.line);

    return this.layer;
  }

  private addedCircles: Circle[] = [];
  private line: Line | null = null;

  private onDragMove(from: ShapeConfig, to: ShapeConfig): void {
    const points = this.lineCalculation.computeExpectedPoints(from, to);
    this.addedCircles.forEach((c) => c.remove(this.layer));

    this.addedCircles = points.map((c) => {
      const circle = new Circle({
        x: c.x,
        y: c.y,
        radius: 2,
        fill: "red",
        stroke: "black",
        strokeWidth: 4
      });
      this.layer.add(circle);
      return circle;
    });

    this.line?.update(points);
  }
}
