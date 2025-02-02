import { ViewPort } from "../../viewport";
import { Point } from "../point";
import { DraggableManager } from "../../draggable/draggable-manager";
import { EventEmitter, ShapeEventMap } from "../../core/event-emitter";
import { Draggable } from "../../draggable/draggable.model";
import { Shape } from "./shape";

export type RectConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
};

export class Rect
  extends EventEmitter<ShapeEventMap>
  implements Shape, Draggable
{
  private position: Point;

  constructor(private readonly config: RectConfig) {
    super();

    this.position = Point.new(config.x, config.y);

    if (config.draggable) {
      DraggableManager.registerDraggableShape(this);
    }
  }

  public draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    context.beginPath();
    context.rect(
      this.position.x,
      this.position.y,
      this.config.width,
      this.config.height
    );
    context.fillStyle = this.config.fill;
    context.strokeStyle = this.config.stroke;
    context.lineWidth = this.config.strokeWidth;
    context.fill();
    context.stroke();
    context.closePath();
  }

  public getPosition(): Point {
    return this.position;
  }

  public setPosition(point: Point): void {
    this.position = point;
  }

  public isDraggable(): boolean {
    return this.config.draggable;
  }

  public isInside(mouse: Point): boolean {
    return (
      mouse.x >= this.position.x &&
      mouse.x <= this.position.x + this.config.width &&
      mouse.y >= this.position.y &&
      mouse.y <= this.position.y + this.config.height
    );
  }
}
