import { Point } from "../primitives/point";
import { Draggable, DraggableManager } from "./draggable-manager";
import { ViewPort } from "../viewport";
import { ShapePosition } from "../primitives/shapes/shape";

export class DraggableService {
  private readonly canvas: HTMLCanvasElement;
  private isDragging = false;
  private target: ShapePosition;
  private currentTarget: Draggable | null = null;

  constructor(private readonly viewPort: ViewPort) {
    this.canvas = this.viewPort.canvas;
    this.target = {
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

      this.target = {
        ...Point.new(
          mouse.x - target.position().x,
          mouse.y - target.position().y
        ),
        width: target.position().width,
        height: target.position().height
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
      ...Point.new(mouse.x - this.target.x, mouse.y - this.target.y),
      height: this.target.height,
      width: this.target.width
    };

    this.currentTarget.setPosition(changedShape);
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
