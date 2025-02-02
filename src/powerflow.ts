import { FollowingEyes } from "./features/following-eyes";
import { Layer as Layer } from "./core/layer";
import { Point } from "./primitives/point";
import { ShapeFactory } from "./primitives/shapes/shape-factory";
import { Stage } from "./core/stage";

export class PowerFlow {
  constructor() {
    const stage = new Stage({
      canvas: document.getElementById("powerflow") as HTMLCanvasElement
    });

    const followingEyesLayer = new Layer();
    followingEyesLayer.add(new FollowingEyes());

    stage.add(followingEyesLayer);

    const shapesLayer = new Layer();

    const rect1 = ShapeFactory.Rect({
      x: -250,
      y: -155,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    const rect2 = ShapeFactory.Rect({
      x: 100,
      y: -50,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    const line = ShapeFactory.Line({
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

    shapesLayer.add(rect1);
    shapesLayer.add(rect2);
    shapesLayer.add(line);

    stage.add(shapesLayer);
  }

  private onDragMove(point: Point): void {
    console.log(point);
  }
}
