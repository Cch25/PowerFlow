import { ViewPort } from "../../viewport";

export interface Shape {
  draw(viewPort: ViewPort): void;
}
