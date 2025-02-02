import { Stage } from "./core/stage";
import { FollowingEyesLayer } from "./layers/following-eye.layer";
import { ShapesLayer } from "./layers/shapes.layer";

export class PowerFlow {
  constructor() {
    const stage = new Stage({
      canvas: document.getElementById("powerflow") as HTMLCanvasElement
    });
    stage.add(new FollowingEyesLayer());
    stage.add(new ShapesLayer());
  }
}
