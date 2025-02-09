import { Point } from "../../primitives/point";
import { ShapeConfig } from "../../primitives/shapes/shape";

const MIN_DISTANCE = 30;

export class CorrelationLineCalculator {
  private from!: ShapeConfig;
  private to!: ShapeConfig;

  /**
   * Computes a path (list of points) that connects two shapes.
   *
   * The algorithm:
   * 1. Computes “connection points” for each shape.
   * 2. Creates offset points and candidate “waypoints” (including bounding box corners and intersections).
   * 3. Removes duplicate candidates.
   * 4. Uses DFS (with adjacent candidates determined by axis-aligned movement) to find a valid route.
   * 5. Returns the route (adding back the original connection points).
   */
  public computeExpectedPoints(
    from: ShapeConfig,
    to: ShapeConfig
  ): Point[] {
    this.from = from;
    this.to = to;

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
      // Add “extra” candidate intersection points if a straight vertical crossing isn’t found.
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
    const path = this.dfsFindPath(offsetStart, offsetEnd, candidates);
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

  /**
   * Uses depth-first search to find a path from `start` to `end` using candidate points.
   */
  private dfsFindPath(start: Point, end: Point, candidates: Point[]): Point[] {
    let result: Point[] = [];
    const visited: Set<string> = new Set();

    const dfs = (path: Point[], current: Point): boolean => {
      if (this.pointsEqual(current, end)) {
        result = [...path, current];
        return true;
      }

      const key = `${current.x}-${current.y}`;
      if (visited.has(key)) {
        return false;
      }
      visited.add(key);

      // Get all candidate points adjacent (axis-aligned) to the current point.
      const nextPoints = this.getAdjacentPoints(current, candidates);
      for (const next of nextPoints) {
        if (dfs([...path, current], next)) {
          return true;
        }
      }
      visited.delete(key);
      return false;
    };

    dfs([], start);
    return result;
  }

  /**
   * Returns true if two points are identical.
   */
  private pointsEqual(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
  }

  /**
   * Finds all candidates adjacent to `point` (i.e. in a horizontal or vertical line)
   * and returns the closest ones in each direction.
   */
  private getAdjacentPoints(point: Point, candidates: Point[]): Point[] {
    // Separate candidates based on alignment.
    const sameX = candidates.filter(
      (p) => p.x === point.x && !this.pointsEqual(p, point)
    );
    const sameY = candidates.filter(
      (p) => p.y === point.y && !this.pointsEqual(p, point)
    );

    const adjacent: Point[] = [];
    // For candidates with the same y (varying x), look for the nearest left/right.
    adjacent.push(...this.findNextPointsInDirection(point, sameY, "x"));
    // For candidates with the same x (varying y), look for the nearest up/down.
    adjacent.push(...this.findNextPointsInDirection(point, sameX, "y"));
    return adjacent;
  }

  /**
   * Given a list of candidate points that share the same “other” coordinate,
   * finds the closest point before and after `current` along the specified axis.
   *
   * For axis "x", this returns the closest points to the left and right;
   * for "y", it returns the closest above and below.
   */
  private findNextPointsInDirection(
    current: Point,
    candidates: Point[],
    axis: "x" | "y"
  ): Point[] {
    const currentValue = axis === "x" ? current.x : current.y;
    let before: Point | null = null;
    let after: Point | null = null;

    for (const candidate of candidates) {
      if (this.lineIntersectsShapes(current, candidate)) {
        continue;
      }
      const candidateValue = axis === "x" ? candidate.x : candidate.y;
      if (candidateValue < currentValue) {
        if (!before || candidateValue > (axis === "x" ? before.x : before.y)) {
          before = candidate;
        }
      } else if (candidateValue > currentValue) {
        if (!after || candidateValue < (axis === "x" ? after.x : after.y)) {
          after = candidate;
        }
      }
    }
    return [before, after].filter((p) => p !== null) as Point[];
  }

  private lineIntersectsShapes(a: Point, b: Point): boolean {
    const rects = [this.from, this.to];
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);

    if (a.y === b.y) {
      return rects.some(
        (rect) =>
          minY >= rect.y &&
          minY <= rect.y + rect.height &&
          minX <= rect.x + rect.width &&
          maxX >= rect.x
      );
    } else if (a.x === b.x) {
      return rects.some(
        (rect) =>
          minX >= rect.x &&
          minX <= rect.x + rect.width &&
          minY <= rect.y + rect.height &&
          maxY >= rect.y
      );
    }
    return false;
  }
}
