import { FollowingEyes } from "./options/following-eyes";
import { GridDot } from "./options/show-grid";
import { PfLayer } from "./primitives/layer";
import { PfShapeFactory } from "./primitives/shapes/shape-factory";
import { ViewPort } from "./viewport";

export class PowerFlow {
  private readonly followingEyes: FollowingEyes;
  private readonly layer: PfLayer;

  constructor(private readonly viewPort: ViewPort) {
    this.followingEyes = new FollowingEyes(viewPort);
    this.layer = new PfLayer();
    const factory = new PfShapeFactory(this.viewPort);

    const rect1 = factory.Rect({
      x: -250,
      y: -155,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    const rect2 = factory.Rect({
      x: 100,
      y: -50,
      width: 100,
      height: 100,
      fill: "#fbfbfb",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    });

    rect1.on("dragmove", (point) => {
      console.log(point);
    });

    this.layer.add(rect1);
    this.layer.add(rect2);
  }

  public draw() {
    this.followingEyes.suspect();
    this.layer.draw();
  }
}
