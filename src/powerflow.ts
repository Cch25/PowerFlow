export class PowerFlow {
  private readonly context = this.canvas.getContext("2d")!;

  constructor(private readonly canvas: HTMLCanvasElement) {
    window.addEventListener("mousedown", (e) => {
      this.context.globalCompositeOperation = "source-over";
      this.drawCube(e.clientX, e.clientY, 100, e.button === 2);
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  public draw() {}

  private drawCube(
    centerX: number,
    centerY: number,
    size: number,
    topPartInBack?: boolean
  ) {
    this.context.beginPath();
    const radius = size / 2;
    for (let slice = 0; slice <= 6; slice++) {
      const angle = (Math.PI / 3) * slice - Math.PI / 6;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (slice === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }

      if (slice % 2 === 0) {
        if (slice === 6 && topPartInBack) {
          this.context.globalCompositeOperation = "destination-over";
        }
        this.context.lineTo(centerX, centerY);
        this.context.fillStyle = ["#444", "#AAA", "#888"][slice / 2 - 1];
        this.context.fill();
        this.context.beginPath();
        this.context.moveTo(x, y);
      }
    }
  }
}
