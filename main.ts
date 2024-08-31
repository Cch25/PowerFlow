import { PowerFlow } from "./src/powerflow";
import { ViewPort } from "./src/viewport";
import "./styles.scss";

const powerflowCanvas = document.getElementById(
  "powerflow"
) as HTMLCanvasElement;

let viewPort: ViewPort;
let powerFlow: PowerFlow;

function init() {
  powerflowCanvas.width = window.innerWidth;
  powerflowCanvas.height = window.innerHeight;
 
  if (powerflowCanvas) {
    viewPort = new ViewPort(powerflowCanvas);
    powerFlow = new PowerFlow(viewPort);
  } else {
    throw new Error("Unable to initialize canvas.");
  }
  animate();
}

function animate() {
  viewPort.reset();
  powerFlow.draw();
  requestAnimationFrame(animate);
}

init();
