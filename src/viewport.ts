import { PfMath } from "./math/utils";
import { Point } from "./primitives/point";

type ViewPortDragOptions = {
  start: Point;
  end: Point;
  offset: Point;
  active: boolean;
};

type ViewPortOptions = {
  center: Point;
  offset: Point;
  zoom: number;
  maxZoom?: number;
  minZoom?: number;
};

export class ViewPort {
  public readonly context: CanvasRenderingContext2D;
  public readonly options: ViewPortOptions;
  private drag: ViewPortDragOptions;

  constructor(public readonly canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;

    this.options = {
      zoom: 1,
      center: new Point(canvas.width / 2, canvas.height / 2),
      offset: Point.zero()
    };

    this.drag = {
      start: Point.zero(),
      end: Point.zero(),
      offset: Point.zero(),
      active: false
    };

    this.addEventListeners();
  }

  public reset(): void {
    this.context.restore();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    const { x, y } = this.options.center;
    this.context.translate(x, y);
    this.context.scale(1 / this.options.zoom, 1 / this.options.zoom);
    const offset = this.getOffset();
    this.context.translate(offset.x, offset.y);
  }

  public getMouse(e: MouseEvent, subtractDragOffset: boolean = false): Point {
    const point = new Point(
      (e.offsetX - this.options.center.x) * this.options.zoom -
        this.options.offset.x,
      (e.offsetY - this.options.center.y) * this.options.zoom -
        this.options.offset.y
    );
    return subtractDragOffset
      ? PfMath.subtract(point, this.drag.offset)
      : point;
  }

  private getOffset = (): Point =>
    PfMath.add(this.options.offset, this.drag.offset);

  private addEventListeners = (): void => {
    this.canvas.addEventListener("mousewheel", this.mouseWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  };

  private mouseDown = (e: MouseEvent): void => {
    if (e.button === 0 && e.ctrlKey) {
      this.drag.start = this.getMouse(e);
      this.drag.active = true;
    }
  };

  private mouseMove = (e: MouseEvent): void => {
    if (this.drag.active) {
      this.drag.end = this.getMouse(e);
      this.drag.offset = PfMath.subtract(this.drag.end, this.drag.start);
    }
  };

  private mouseUp = (): void => {
    if (this.drag.active) {
      this.options.offset = PfMath.add(this.options.offset, this.drag.offset);
      this.drag = {
        start: Point.zero(),
        end: Point.zero(),
        offset: Point.zero(),
        active: false
      };
    }
  };

  private mouseWheel = (e: Event): void => {
    if ((e as WheelEvent).ctrlKey) {
      e.preventDefault();
      const direction = Math.sign((e as WheelEvent).deltaY);
      const step = 0.1;
      this.options.zoom += direction * step;
      const minZoom = Math.max(this.options.minZoom ?? 0.1, 0.1);
      const maxZoom = Math.min(this.options.maxZoom ?? 10, 10);
      this.options.zoom = Math.max(
        minZoom,
        Math.min(maxZoom, this.options.zoom)
      );
    }
  };
}
