import { Point } from "../../primitives/point";
import { ShapeConfig } from "../../primitives/shapes/shape";
import { AStar } from "./astar";
import { Dfs } from "./dfs";

const MIN_DISTANCE = 30;

export class CorrelationLineCalculator {
  /**
   * Computes a path (list of points) that connects two shapes.
   *
   * The algorithm:
   * 1. Computes "connection points" for each shape.
   * 2. Creates offset points and candidate "waypoints" (including bounding box corners and intersections).
   * 3. Removes duplicate candidates.
   * 4. Uses DFS (with adjacent candidates determined by axis-aligned movement) to find a valid route.
   * 5. Returns the route (adding back the original connection points).
   */
  public computeExpectedPoints(from: ShapeConfig, to: ShapeConfig): Point[] {
    // Determine primary connection points.
    const startPoint = Point.new(from.x + from.width / 2, from.y);
    const endPoint = Point.new(to.x + to.width / 2, to.y);

    // Calculate offset points for routing (moves connection point away from the shape’s border).
    const offsetStart = this.calculateOffsetPoint(from, startPoint);
    const offsetEnd = this.calculateOffsetPoint(to, endPoint);

    // Gather candidate waypoints.
    let candidates: Point[] = [offsetStart, offsetEnd];
    candidates.push(
      ...this.calculateBoundingBoxPoints([
        offsetStart,
        offsetEnd,
        Point.new(from.x - MIN_DISTANCE, from.y - MIN_DISTANCE),
        Point.new(
          from.x + from.width + MIN_DISTANCE,
          from.y + from.height + MIN_DISTANCE
        )
      ])
    );
    candidates.push(
      ...this.calculateBoundingBoxPoints([
        offsetStart,
        offsetEnd,
        Point.new(to.x - MIN_DISTANCE, to.y - MIN_DISTANCE),
        Point.new(
          to.x + to.width + MIN_DISTANCE,
          to.y + to.height + MIN_DISTANCE
        )
      ])
    );

    // Try adding an intersection between the vertical lines from the connection points.
    const intersection = this.getIntersection(
      [startPoint, offsetStart],
      [endPoint, offsetEnd]
    );
    if (intersection) {
      candidates.push(intersection);
    } else {
      // Add "extra" candidate intersection points if a straight vertical crossing isn’t found.
      const extras = [
        this.getIntersection(
          [startPoint, offsetStart],
          [offsetEnd, Point.new(offsetEnd.x + 10, offsetEnd.y)]
        ),
        this.getIntersection(
          [startPoint, offsetStart],
          [offsetEnd, Point.new(offsetEnd.x, offsetEnd.y + 10)]
        ),
        this.getIntersection(
          [endPoint, offsetEnd],
          [offsetStart, Point.new(offsetStart.x + 10, offsetStart.y)]
        ),
        this.getIntersection(
          [endPoint, offsetEnd],
          [offsetStart, Point.new(offsetStart.x, offsetStart.y + 10)]
        )
      ].filter((p): p is Point => p !== null);
      candidates.push(...extras);
    }

    // Remove duplicates from the candidate list.
    candidates = this.removeDuplicatePoints(candidates);

    // Use DFS to search for a valid path among the candidate points.
    // const path = new Dfs(from, to).findPath(offsetStart, offsetEnd, candidates);
    const path = new AStar(from, to).findPath(
      offsetStart,
      offsetEnd,
      candidates
    );

    if (path.length === 0) {
      return [];
    }

    // Prepend the original start and append the original end connection points.
    const finalRoute = [startPoint, ...path, endPoint];

    // Return a new copy of the points.
    return finalRoute.map((p) => Point.new(p.x, p.y));
  }

  /**
   * Given a shape and one of its connection points (on the border),
   * return an offset point outside the shape to start/end the routing.
   */
  private calculateOffsetPoint(rect: ShapeConfig, point: Point): Point {
    if (point.x === rect.x) {
      return Point.new(rect.x - MIN_DISTANCE, rect.y + rect.height / 2);
    } else if (point.y === rect.y) {
      return Point.new(rect.x + rect.width / 2, rect.y - MIN_DISTANCE);
    } else if (point.x === rect.x + rect.width) {
      return Point.new(
        rect.x + rect.width + MIN_DISTANCE,
        rect.y + rect.height / 2
      );
    } else if (point.y === rect.y + rect.height) {
      return Point.new(
        rect.x + rect.width / 2,
        rect.y + rect.height + MIN_DISTANCE
      );
    }
    return Point.zero();
  }

  /**
   * Given an array of points, returns the four corner points of their bounding box.
   */
  private calculateBoundingBoxPoints(points: Point[]): Point[] {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return [
      Point.new(minX, minY),
      Point.new(maxX, minY),
      Point.new(minX, maxY),
      Point.new(maxX, maxY)
    ];
  }

  /**
   * For two segments that are assumed to be axis-aligned (one horizontal, one vertical),
   * returns their intersection point, if one exists.
   *
   * (If both segments are parallel, this returns null.)
   */
  private getIntersection(
    seg1: [Point, Point],
    seg2: [Point, Point]
  ): Point | null {
    const [p1, p2] = seg1;
    const [p3, p4] = seg2;

    // If both segments are vertical or both horizontal, no proper crossing.
    if ((p1.x === p2.x && p3.x === p4.x) || (p1.y === p2.y && p3.y === p4.y)) {
      return null;
    }
    // If seg1 is horizontal and seg2 vertical.
    if (p1.y === p2.y && p3.x === p4.x) {
      return Point.new(p3.x, p1.y);
    }
    // If seg1 is vertical and seg2 horizontal.
    if (p1.x === p2.x && p3.y === p4.y) {
      return Point.new(p1.x, p3.y);
    }
    return null;
  }

  /**
   * Removes duplicate points (based on x and y coordinates).
   */
  private removeDuplicatePoints(points: Point[]): Point[] {
    const unique = new Map<string, Point>();
    for (const p of points) {
      const key = `${p.x}-${p.y}`;
      if (!unique.has(key)) {
        unique.set(key, Point.new(p.x, p.y));
      }
    }
    return Array.from(unique.values());
  }
}
