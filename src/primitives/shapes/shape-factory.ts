import { Draggable } from "../../draggable/draggable";
import { ViewPort } from "../../viewport";
import { Rect, RectConfig } from "./rect";

export class PfShapeFactory {
  constructor(private readonly viewPort: ViewPort) {
    new Draggable(this.viewPort).init();
  }

  public Rect(rect: RectConfig) {
    return new Rect(rect, this.viewPort);
  }
}
