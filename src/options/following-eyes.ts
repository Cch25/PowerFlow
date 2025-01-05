import { PfMath } from "../math/utils";
import { Point } from "../primitives/point";
import { ViewPort } from "../viewport";

export class FollowingEyes {
  private readonly pupilRadius = 10;
  private readonly eyeBallRadius = 20;
  private readonly distanceBetweenEyes = 45;
  private readonly context: CanvasRenderingContext2D;

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

  constructor(private readonly viewPort: ViewPort) {
    this.context = this.viewPort.context;
    window.addEventListener("mousemove", (e) => {
      const { dx: a, dy: b } = this.follow(e, this.leftEyeCenter);
      this.leftEyePupil.x = a;
      this.leftEyePupil.y = b;

      const { dx: c, dy: d } = this.follow(e, this.rightEyeCenter);
      this.rightEyePupil.x = c;
      this.rightEyePupil.y = d;
    });
  }

  private follow(e: MouseEvent, eyeCenter: Point) {
    const diff_x = this.viewPort.getMouse(e).x - eyeCenter.x;
    const diff_y = this.viewPort.getMouse(e).y - eyeCenter.y;

    const dist = PfMath.distanceTo(
      eyeCenter,
      new Point(this.viewPort.getMouse(e).x, this.viewPort.getMouse(e).y)
    );

    const angle = Math.atan2(diff_y, diff_x);

    const dx = eyeCenter.x + Math.min(dist, this.pupilRadius) * Math.cos(angle);
    const dy = eyeCenter.y + Math.min(dist, this.pupilRadius) * Math.sin(angle);
    return { dx, dy };
  }

  public suspect() {
    this.drawEyeBall(this.leftEyeCenter);
    this.drawPupil(this.leftEyePupil);

    this.drawEyeBall(this.rightEyeCenter);
    this.drawPupil(this.rightEyePupil);
  }

  private drawEyeBall(eye: Point) {
    this.context.beginPath();
    this.context.arc(eye.x, eye.y, this.eyeBallRadius, 0, 2 * Math.PI);
    this.context.stroke();
  }

  private drawPupil(pos: Point) {
    this.context.beginPath();
    this.context.arc(pos.x, pos.y, this.pupilRadius, 0, 2 * Math.PI);
    this.context.fill();
  }
}
