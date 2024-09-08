import { Point } from "../primitives/point";

export class PfMath {
  public static getNearestPoint(
    loc: Point,
    points: Point[],
    threshold: number = Number.MAX_SAFE_INTEGER
  ): Point | null {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest: Point | null = null;
    for (const point of points) {
      const distance = PfMath.distanceTo(point, loc);
      if (distance < minDist && distance < threshold) {
        nearest = point;
        minDist = distance;
      }
    }
    return nearest;
  }

  public static scale = (point: Point, scaler: number): Point =>
    new Point(point.x * scaler, point.y * scaler);

  public static add = (pointA: Point, pointB: Point): Point =>
    new Point(pointA.x + pointB.x, pointA.y + pointB.y);

  public static subtract = (pointA: Point, pointB: Point): Point =>
    new Point(pointA.x - pointB.x, pointA.y - pointB.y);

  public static distanceTo = (pointA: Point, pointB: Point): number =>
    Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}
