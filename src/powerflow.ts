import { Draggable } from "./draggable/draggable";
import { PfMath } from "./math/utils";
import { FollowingEyes } from "./options/following-eyes";
import { ShowGrid } from "./options/show-grid";
import { Point } from "./primitives/point";
import { ViewPort } from "./viewport";

type PFObject = {
  label: string;
  pos: Point;
};
const RADIUS = 50;

export class PowerFlow {
  private readonly context: CanvasRenderingContext2D;
  private readonly showGrid: ShowGrid;
  private pfObjects: PFObject[] = [
    { label: "A", pos: Point.new(50, 50) },
    { label: "B", pos: Point.new(-200, -200) },
    { label: "C", pos: Point.new(-150, -50) }
  ];

  private readonly followingEyes: FollowingEyes;

  constructor(private readonly viewPort: ViewPort) {
    this.context = this.viewPort.context;
    this.followingEyes = new FollowingEyes(viewPort);

    const draggable = new Draggable(this.viewPort);
    this.showGrid = new ShowGrid(this.viewPort);

    let nbr = 1;
    this.viewPort.canvas.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        const point = PfMath.getNearestPoint(
          this.viewPort.getMouse(e, true),
          this.pfObjects.map((p) => p.pos),
          RADIUS
        );
        if (point) {
          draggable.move(point);
        }
      }

      if (e.button === 2) {
        const mouse = this.viewPort.getMouse(e, true);
        this.pfObjects.push({
          label: `New ${nbr++}`,
          pos: Point.new(mouse.x, mouse.y)
        });
      }
    });
  }

  public draw() {
    this.showGrid.draw();
    this.followingEyes.suspect();

    for (const pfObj of this.pfObjects) {
      this.drawCircle(pfObj);
    }
  }

  private drawCircle(pfObj: PFObject) {
    this.context.save();
    this.context.beginPath();
    this.context.translate(pfObj.pos.x / 2, pfObj.pos.y / 2);
    this.context.arc(pfObj.pos.x / 2, pfObj.pos.y / 2, RADIUS, 0, 2 * Math.PI);
    this.context.fillStyle = "#cc22c1";
    this.context.strokeStyle = "#a2a2a2";
    this.context.fill();
    this.context.closePath();

    this.context.fillStyle = "#f3f2f1";
    this.context.font = "18px serif";
    this.context.textAlign = "center";
    this.context.fillText(`${pfObj.label}`, pfObj.pos.x / 2, pfObj.pos.y / 2);

    this.context.restore();
  }
}
