import { Point } from "../../primitives/point";
import { ShapeConfig } from "../../primitives/shapes/shape";

export class Dfs {
  constructor(
    private readonly from: ShapeConfig,
    private readonly to: ShapeConfig,
    private readonly minDistance: number
  ) {}

  /**
   * Uses depth-first search to find a path from `start` to `end` using candidate points.
   */
  public findPath(start: Point, end: Point, candidates: Point[]): Point[] {
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
   * Given a list of candidate points that share the same "other" coordinate,
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
      for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        if (
          minY > rect.y - this.minDistance &&
          minY < rect.y + rect.height + this.minDistance &&
          minX < rect.x + rect.width + this.minDistance &&
          maxX > rect.x - 30
        ) {
          return true;
        }
      }
    } else if (a.x === b.x) {
      for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        if (
          minX > rect.x - this.minDistance &&
          minX < rect.x + rect.width + this.minDistance &&
          minY < rect.y + rect.height + this.minDistance &&
          maxY > rect.y - 30
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
