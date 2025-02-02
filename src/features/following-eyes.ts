import { PfMath } from "../math/utils";
import { Point } from "../primitives/point";
import { Shape } from "../primitives/shapes/shape";
import { ViewPort } from "../viewport";

export class FollowingEyes implements Shape {
  private readonly pupilRadius = 10;
  private readonly eyeBallRadius = 20;
  private readonly distanceBetweenEyes = 45;

  private readonly leftEyeCenter = new Point(
    -(window.innerWidth / 2.5) -
      this.eyeBallRadius -
      this.distanceBetweenEyes / 2,
    -window.innerHeight / 2.5
  );
  private readonly rightEyeCenter = new Point(
    -(window.innerWidth / 2.5) -
      this.eyeBallRadius +
      this.distanceBetweenEyes / 2,
    -window.innerHeight / 2.5
  );

  private readonly leftEyePupil = new Point(
    this.leftEyeCenter.x,
    this.leftEyeCenter.y
  );

  private readonly rightEyePupil = new Point(
    this.rightEyeCenter.x,
    this.rightEyeCenter.y
  );

  private viewPort: ViewPort | null = null;

  constructor() {
    window.addEventListener("mousemove", (e) => {
      if (this.viewPort) {
        const { dx: a, dy: b } = this.follow(e, this.leftEyeCenter);
        this.leftEyePupil.x = a;
        this.leftEyePupil.y = b;

        const { dx: c, dy: d } = this.follow(e, this.rightEyeCenter);
        this.rightEyePupil.x = c;
        this.rightEyePupil.y = d;
      }
    });
  }

  draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    if (!this.viewPort) {
      this.viewPort = viewPort;
    }
    this.drawEyeBall(this.leftEyeCenter, context);
    this.drawPupil(this.leftEyePupil, context);

    this.drawEyeBall(this.rightEyeCenter, context);
    this.drawPupil(this.rightEyePupil, context);
  }

  private follow(e: MouseEvent, eyeCenter: Point) {
    const diff_x = this.viewPort!.getMouse(e).x - eyeCenter.x;
    const diff_y = this.viewPort!.getMouse(e).y - eyeCenter.y;

    const dist = PfMath.distanceTo(
      eyeCenter,
      new Point(this.viewPort!.getMouse(e).x, this.viewPort!.getMouse(e).y)
    );

    const angle = Math.atan2(diff_y, diff_x);

    const dx = eyeCenter.x + Math.min(dist, this.pupilRadius) * Math.cos(angle);
    const dy = eyeCenter.y + Math.min(dist, this.pupilRadius) * Math.sin(angle);
    return { dx, dy };
  }

  private drawEyeBall(eye: Point, context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(eye.x, eye.y, this.eyeBallRadius, 0, 2 * Math.PI);
    context.stroke();
 
  }

  private drawPupil(pos: Point, context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(pos.x, pos.y, this.pupilRadius, 0, 2 * Math.PI);
    context.fill();
  }
}
