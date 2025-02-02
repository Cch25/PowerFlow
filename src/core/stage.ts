import { DraggableService } from "../draggable/draggable.service";
import { SetUpLayer } from "../layers/setup.layer";
import { ViewPort } from "../viewport";
import { Layer } from "./layer";

type StageConfig = {
  canvas: HTMLCanvasElement | null;
  width?: number;
  height?: number;
};

export class Stage {
  private readonly viewPort: ViewPort;
  private readonly layers: Layer[] = [];

  constructor(private readonly stage: StageConfig) {
    if (this.stage.canvas) {
      this.stage.canvas.width = window.innerWidth;
      this.stage.canvas.height = window.innerHeight;
      this.viewPort = new ViewPort(this.stage.canvas);
      new DraggableService(this.viewPort).init();
    } else {
      throw new Error("Unable to initialize canvas.");
    }
    this.animate();
  }

  public add(layer: SetUpLayer) {
    this.layers.push(layer.init());
  }

  private animate() {
    this.viewPort.reset();
    this.layers.forEach((layer) => layer.draw(this.viewPort));
    requestAnimationFrame(() => this.animate());
  }
}
