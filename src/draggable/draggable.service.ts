import { Point } from "../primitives/point";
import { Draggable, DraggableManager } from "./draggable-manager";
import { ViewPort } from "../viewport";
import { ShapeConfig } from "../primitives/shapes/shape";

export class DraggableService {
  private readonly canvas: HTMLCanvasElement;
  private isDragging = false;
  private shapeConfig: ShapeConfig;
  private currentTarget: Draggable | null = null;

  constructor(private readonly viewPort: ViewPort) {
    this.canvas = this.viewPort.canvas;
    this.shapeConfig = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  public listen() {
    this.attachListeners();
  }

  private attachListeners() {
    this.canvas.addEventListener("mousedown", (e) => this.startDrag(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrag());
    this.canvas.addEventListener("mousemove", (e) => this.handleDrag(e));
  }

  private startDrag(e: MouseEvent) {
    const mouse = this.viewPort.getMouse(e);
    const target = this.findDraggableShape(mouse);

    if (target) {
      this.isDragging = true;
      this.currentTarget = target;

      this.shapeConfig = {
        ...Point.new(
          mouse.x - target.getCofig().x,
          mouse.y - target.getCofig().y
        ),
        width: target.getCofig().width,
        height: target.getCofig().height
      };
    }
  }

  private stopDrag() {
    this.isDragging = false;
    this.currentTarget = null;
  }

  private handleDrag(e: MouseEvent) {
    if (!this.isDragging || !this.currentTarget) {
      return;
    }

    const mouse = this.viewPort.getMouse(e);
    const changedShape = {
      ...Point.new(mouse.x - this.shapeConfig.x, mouse.y - this.shapeConfig.y),
      height: this.shapeConfig.height,
      width: this.shapeConfig.width
    };

    this.currentTarget.setConfig(changedShape);
    this.currentTarget.emit("dragmove", changedShape);
  }

  private findDraggableShape(mouse: Point): Draggable | null {
    return (
      DraggableManager.getDraggableShapes().find(
        (shape) => shape.isDraggable() && shape.isInside(mouse)
      ) || null
    );
  }
}
