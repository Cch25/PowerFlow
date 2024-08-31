import { ViewPort } from "./viewport";

export class PowerFlow {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly viewPort: ViewPort) {
    this.context = this.viewPort.context;
  }

  public draw() {
     
    this.drawSquare();
  }

  private drawSquare() {
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(0, -50);
    this.context.lineTo(50, -50);
    this.context.lineTo(50, 0);
    this.context.lineTo(0, 0);
    this.context.stroke();
  }
}
