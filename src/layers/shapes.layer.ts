import { Layer } from "../core/layer";
import { Point } from "../primitives/point";
import { Line } from "../primitives/shapes/line";
import { Rect } from "../primitives/shapes/rect";
import { SetUpLayer } from "./setup.layer";

export class ShapesLayer implements SetUpLayer {
  public init(): Layer {
    const layer = new Layer();

    const rect1 = new Rect({
      x: -250,
      y: -155,
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

    const line = new Line({
      lineJoin: "round",
      points: [
        Point.new(-200, -155),
        Point.new(-200, -200),
        Point.new(150, -200),
        Point.new(150, -50)
      ],
      stroke: "black",
      strokeWidth: 2
    });

    rect1.on("dragmove", this.onDragMove);
    rect2.on("dragmove", this.onDragMove);

    layer.add(rect1);
    layer.add(rect2);
    layer.add(line);

    return layer;
  }

  private onDragMove(point: Point): void {
    console.log(point);
  }
}
