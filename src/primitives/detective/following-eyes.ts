import { PfMath } from "../../math/utils";
import { Point } from "../point";
import { Shape } from "../shapes/shape";
import { ViewPort } from "../../viewport";

const pupilRadius = 10;
const eyeRad = 20;
const eyeGap = 45;
const eyePosX = -window.innerWidth / 2.5;
const eyePosY = -window.innerHeight / 2.5;

export class FollowingEyes implements Shape {
  private viewPort: ViewPort | null = null;
  private readonly lEye = new Point(eyePosX - eyeRad - eyeGap / 2, eyePosY);
  private readonly rEye = new Point(eyePosX - eyeRad + eyeGap / 2, eyePosY);
  private readonly lPupil = new Point(this.lEye.x, this.lEye.y);
  private readonly rPupil = new Point(this.rEye.x, this.rEye.y);

  constructor() {
    //Global mousemove event, the eyes should always follow the cursor
    window.addEventListener("mousemove", (e) => this.updatePupils(e));
  }

  private updatePupils(e: MouseEvent): void {
    if (this.viewPort) {
      this.updatePupilPosition(e, this.lEye, this.lPupil);
      this.updatePupilPosition(e, this.rEye, this.rPupil);
    }
  }

  private updatePupilPosition(e: MouseEvent, eye: Point, pupil: Point): void {
    const { dx, dy } = this.computePupilPos(e, eye);
    pupil.x = dx;
    pupil.y = dy;
  }

  private computePupilPos(e: MouseEvent, eyeCenter: Point) {
    const mousePos = this.viewPort!.getMouse(e);
    const diffX = mousePos.x - eyeCenter.x;
    const diffY = mousePos.y - eyeCenter.y;
    const dist = PfMath.distanceTo(eyeCenter, mousePos);
    const angle = Math.atan2(diffY, diffX);

    const dx = eyeCenter.x + Math.min(dist, pupilRadius) * Math.cos(angle);
    const dy = eyeCenter.y + Math.min(dist, pupilRadius) * Math.sin(angle);

    return { dx, dy };
  }

  draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    if (!this.viewPort) {
      this.viewPort = viewPort;
    }

    this.drawEyeBall(this.lEye, context);
    this.drawPupil(this.lPupil, context);

    this.drawEyeBall(this.rEye, context);
    this.drawPupil(this.rPupil, context);
  }

  private drawEyeBall(eye: Point, context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(eye.x, eye.y, eyeRad, 0, 2 * Math.PI);
    context.stroke();
  }

  private drawPupil(pos: Point, context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(pos.x, pos.y, pupilRadius, 0, 2 * Math.PI);
    context.fill();
  }
}
