import { Point } from "../primitives/point";

export class PfMath {
  public static scale = (point: Point, scaler: number): Point =>
    new Point(point.x * scaler, point.y * scaler);

  public static add = (pointA: Point, pointB: Point): Point =>
    new Point(pointA.x + pointB.x, pointA.y + pointB.y);

  public static subtract = (pointA: Point, pointB: Point): Point =>
    new Point(pointA.x - pointB.x, pointA.y - pointB.y);

  public static distanceTo = (pointA: Point, pointB: Point): number =>
    Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}
