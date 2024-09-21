import { ViewPort } from "../viewport";

const space = 37.79; //1cm
const dotRadius = 1;

export class ShowGrid {
  constructor(private readonly viewPort: ViewPort) {}

  public draw(zoom: number = 0.8) {
    const { canvas, context, options } = this.viewPort;
    if (options.zoom > zoom) {
      return;
    }

    const { width, height } = canvas;
    const { offset } = options;
    const offsetX = Math.abs(offset.x);
    const offsetY = Math.abs(offset.y);

    context.beginPath();
    context.fillStyle = "gray";

    for (let x = -width / 2 - offsetX; x <= width / 2 + offsetX; x += space) {
      for (
        let y = -height / 2 - offsetY;
        y <= height / 2 + offsetY;
        y += space
      ) {
        context.moveTo(x * space, y * space);
        context.arc(x, y, dotRadius, 0, 2 * Math.PI);
      }
    }

    context.fill();
  }
}
