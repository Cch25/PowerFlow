import { Line, LineConfig } from "./line";
import { Rect, RectConfig } from "./rect";

export class ShapeFactory {
  public static Rect(rect: RectConfig) {
    return new Rect(rect);
  }

  public static Line(line: LineConfig) {
    return new Line(line);
  }
}
