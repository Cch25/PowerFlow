import { Point } from "../primitives/point";
import { Shape } from "../primitives/shapes/shape";
import { ShapeManager } from "../primitives/shapes/shape-manager";
import { ViewPort } from "../viewport";

export class Draggable {
  private readonly canvas: HTMLCanvasElement;
  private isDragging = false;
  private dragOffset = Point.new(0, 0);
  private currentTarget: Shape | null = null;

  constructor(private readonly viewPort: ViewPort) {
    this.canvas = this.viewPort.canvas;
  }

  public init() {
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

      this.dragOffset = Point.new(
        mouse.x - target.getPosition().x,
        mouse.y - target.getPosition().y
      );
    }
  }

  private stopDrag() {
    this.isDragging = false;
    this.currentTarget = null;
  }

  private handleDrag(e: MouseEvent) {
    if (!this.isDragging || !this.currentTarget) return;

    const mouse = this.viewPort.getMouse(e);
    const newPoint = Point.new(
      mouse.x - this.dragOffset.x,
      mouse.y - this.dragOffset.y
    );

    this.currentTarget.setPosition(newPoint);
    this.currentTarget.emit("dragmove", newPoint);
  }

  private findDraggableShape(mouse: Point): Shape | null {
    return (
      ShapeManager.getShapes().find(
        (shape) => shape.isDraggable() && shape.isInside(mouse)
      ) || null
    );
  }
}
