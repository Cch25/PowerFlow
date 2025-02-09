import { ViewPort } from "../../viewport";

export interface Shape {
  draw(viewPort: ViewPort): void;
}

export interface ShapePosition {
  get x(): number;
  get y(): number;
  get width(): number;
  get height(): number;
}
