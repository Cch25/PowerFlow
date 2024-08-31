import { PfMath } from "./math/utils";
import { Point } from "./primitives/point";
import { ViewPort } from "./viewport";

type PFObject = {
  label: string;
  pos: Point;
};

export class PowerFlow {
  private readonly context: CanvasRenderingContext2D;
  private foundPfObj: PFObject | null = null;

  private pfObjects: PFObject[] = [
    { label: "A", pos: Point.new(50, 50) },
    { label: "B", pos: Point.new(-200, -200) },
    { label: "C", pos: Point.new(-150, -50) }
  ];

  constructor(private readonly viewPort: ViewPort) {
    this.context = this.viewPort.context;

    this.viewPort.canvas.addEventListener("mousemove", (e) => {
      for (const square of this.pfObjects) {
        if (
          PfMath.distanceTo(square.pos, this.viewPort.getMouse(e, true)) < 50
        ) {
          this.foundPfObj = square;
          break;
        }
      }
    });
  }

  public draw() {
    for (const pfObj of this.pfObjects) {
      this.drawCircle(pfObj);
    }

    if (this.foundPfObj) {
      this.drawText(this.foundPfObj);
    }
  }

  private drawText(obj: PFObject) {
    this.context.fillStyle = "#aa12aa";
    this.context.font = "19px serif";
    this.context.fillText(
      `Touched square: ${obj.label} ${obj.pos.x}, ${obj.pos.y}`,
      obj.pos.x + 50,
      obj.pos.y
    );
  }

  private drawCircle(pfObj: PFObject) {
    this.context.save();
    this.context.beginPath();
    this.context.translate(pfObj.pos.x / 2, pfObj.pos.y / 2);
    this.context.arc(pfObj.pos.x / 2, pfObj.pos.y / 2, 50, 0, 2 * Math.PI);
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
