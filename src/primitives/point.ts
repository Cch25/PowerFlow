export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static new = (x: number, y: number): Point => new Point(x, y);
  public static zero = () => new Point(0, 0);
  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
