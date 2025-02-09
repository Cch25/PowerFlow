import { ViewPort } from "../../viewport";
import { Point } from "../point";
import { Draggable, DraggableManager } from "../../draggable/draggable-manager";
import { Shape, ShapePosition } from "./shape";

type RectConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
};

export class Rect extends Draggable implements Shape {
  private shapePos: ShapePosition;

  constructor(private readonly config: RectConfig) {
    super();

    this.shapePos = {
      ...Point.new(config.x, config.y),
      width: config.width,
      height: config.height
    };

    if (config.draggable) {
      DraggableManager.registerDraggableShape(this);
    }
  }

  public draw(viewPort: ViewPort): void {
    const context = viewPort.context;
    context.beginPath();
    context.rect(
      this.shapePos.x,
      this.shapePos.y,
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

  public position(): ShapePosition {
    return this.shapePos;
  }

  public setPosition(data: ShapePosition): void {
    this.shapePos = data;
  }

  public isDraggable(): boolean {
    return this.config.draggable;
  }

  public isInside(mouse: Point): boolean {
    return (
      mouse.x >= this.shapePos.x &&
      mouse.x <= this.shapePos.x + this.config.width &&
      mouse.y >= this.shapePos.y &&
      mouse.y <= this.shapePos.y + this.config.height
    );
  }
 
}
