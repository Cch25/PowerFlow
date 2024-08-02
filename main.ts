import { PowerFlow } from "./src/powerflow";
import "./styles.scss";

const powerflowCanvas = document.getElementById(
  "powerflow"
) as HTMLCanvasElement;

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  powerflowCanvas.width = window.innerWidth;
  powerflowCanvas.height = window.innerHeight;

  render();
}

resizeCanvas();

function render(): void {
  if (powerflowCanvas) {
    return new PowerFlow(powerflowCanvas).draw();
  }
  throw new Error("Unable to initialize canvas.");
}
