import { Point } from "../primitives/point";
import { ViewPort } from "../viewport";

export class Draggable {
  private isMouseDown = false;

  constructor(private readonly viewPort: ViewPort) {
    this.viewPort = viewPort;
  }

  public move(pos: Point | null) {
    if (pos) {
      this.viewPort.canvas.addEventListener(
        "mousedown",
        (e) => (this.isMouseDown = e.button === 0)
      );
      this.viewPort.canvas.addEventListener("mousemove", (e) => {
        if (this.isMouseDown && pos) {
          const mouse = this.viewPort.getMouse(e, true);
          pos.x = mouse.x;
          pos.y = mouse.y;
        }
      });
      this.viewPort.canvas.addEventListener("mouseup", () => {
        this.isMouseDown = false;
        pos = null;
      });
    }
  }
}
