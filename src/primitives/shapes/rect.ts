import { ViewPort } from "../../viewport";
import { Point } from "../point";
import { Draggable, DraggableManager } from "../../draggable/draggable-manager";
import { Shape, ShapeConfig } from "./shape";

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
  private shapeConfig: ShapeConfig;

  constructor(private readonly config: RectConfig) {
    super();

    this.shapeConfig = {
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
      this.shapeConfig.x,
      this.shapeConfig.y,
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

  public getCofig(): ShapeConfig {
    return this.shapeConfig;
  }

  public setConfig(data: ShapeConfig): void {
    this.shapeConfig = data;
  }

  public isDraggable(): boolean {
    return this.config.draggable;
  }

  public isInside(mouse: Point): boolean {
    return (
      mouse.x >= this.shapeConfig.x &&
      mouse.x <= this.shapeConfig.x + this.config.width &&
      mouse.y >= this.shapeConfig.y &&
      mouse.y <= this.shapeConfig.y + this.config.height
    );
  }
 
}
