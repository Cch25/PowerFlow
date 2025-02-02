import { ViewPort } from "../../viewport";
import { Point } from "../point";
import { EventEmitter, ShapeEventMap } from "./event-emitter";
import { Shape } from "./shape";
import { ShapeManager } from "./shape-manager";

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

export class Rect extends EventEmitter<ShapeEventMap> implements Shape {
  private readonly context: CanvasRenderingContext2D;
  private position: Point;

  constructor(private readonly config: RectConfig, viewPort: ViewPort) {
    super();
    this.context = viewPort.context;
    this.position = Point.new(config.x, config.y);

    if (config.draggable) {
      ShapeManager.registerShape(this);
    }
  }

  public draw(): void {
    this.context.beginPath();
    this.context.rect(
      this.position.x,
      this.position.y,
      this.config.width,
      this.config.height
    );
    this.context.fillStyle = this.config.fill;
    this.context.strokeStyle = this.config.stroke;
    this.context.lineWidth = this.config.strokeWidth;
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
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
