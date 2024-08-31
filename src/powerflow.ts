import { PfMath } from "./math/utils";
import { Point } from "./primitives/point";
import { ViewPort } from "./viewport";

export class PowerFlow {
  private readonly context: CanvasRenderingContext2D;
  private foundSq: Point | null = null;

  private squares: Point[] = [Point.new(50, 50), Point.new(-200, -200)];

  constructor(private readonly viewPort: ViewPort) {
    this.context = this.viewPort.context;

    this.viewPort.canvas.addEventListener("mousemove", (e) => {
      for (const square of this.squares) {
        if (PfMath.distanceTo(square, this.viewPort.getMouse(e)) < 50) {
          this.foundSq = square;
          break;
        }
      }
    });
  }

  public draw() {
    for (const square of this.squares) {
      this.drawSquare(square.x, square.x);
    }

    if (this.foundSq) {
      this.drawText(this.foundSq);
    }
  }

  private drawText(point: Point) {
    this.context.fillStyle = "red";
    this.context.font = "32px serif";
    this.context.fillText(
      `Touched square: ${point.x}, ${point.y}`,
      point.x,
      point.y
    );
  }

  private drawSquare(x: number, y: number) {
    this.context.beginPath();
    this.context.save();
    this.context.translate(x, y);
    this.context.moveTo(0, 0);
    this.context.lineTo(0, -50);
    this.context.lineTo(50, -50);
    this.context.lineTo(50, 0);
    this.context.lineTo(0, 0);
    this.context.stroke();
    this.context.restore();
  }
}
