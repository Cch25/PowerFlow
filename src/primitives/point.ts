export class Point {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static new = (x: number, y: number): Point => new Point(x, y);
  public static zero = () => new Point(0, 0);
}
