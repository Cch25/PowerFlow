import { Point } from "../../primitives/point";
import { ShapeConfig } from "../../primitives/shapes/shape";

type Node = {
  point: Point;
  g: number; // cost from start to this node
  h: number; // heuristic cost from this node to the goal
  f: number; // total cost: f = g + h
  parent: Node | null;
};

export class AStar {
  constructor(
    private readonly from: ShapeConfig, // used for line intersection tests
    private readonly to: ShapeConfig,
    private readonly minDistance: number,
    private readonly easy: boolean
  ) {}

  /**
   * Finds a path from `start` to `end` using the candidate points.
   * Returns an array of Points representing the route, or [] if no route is found.
   */
  public findPath(start: Point, end: Point, candidates: Point[]): Point[] {
    const openList: Node[] = [];
    const closedList: Node[] = [];

    // Initialize starting node.
    openList.push({
      point: start,
      g: 0,
      h: this.heuristic(start, end),
      f: this.heuristic(start, end),
      parent: null
    });

    while (openList.length > 0) {
      const current = this.getBestNode(openList);

      // If we have reached the destination, build and return the route.
      if (this.pointsEqual(current.point, end)) {
        return this.buildRoute(current);
      }

      // Remove current from openList and add to closedList.
      this.removeFromList(current, openList);
      closedList.push(current);

      // Use the same neighbor selection as in DFS.
      const neighbors = this.getAdjacentPoints(current.point, candidates);
      for (const neighbor of neighbors) {
        // Skip if the neighbor is already evaluated.
        if (this.isPointInNodes(neighbor, closedList)) {
          continue;
        }

        // Compute tentative g (cost from start) for neighbor.
        const tentativeG = current.g + this.distance(current.point, neighbor);

        // Check if neighbor is already in openList.
        const existingNode = this.findNode(neighbor, openList);
        if (existingNode) {
          // If this new path is better, update the node.
          if (tentativeG < existingNode.g) {
            existingNode.g = tentativeG;
            existingNode.f = tentativeG + existingNode.h;
            existingNode.parent = current;
          }
        } else {
          // Create a new node and add it to openList.
          const h = this.heuristic(neighbor, end);
          const neighborNode: Node = {
            point: neighbor,
            g: tentativeG,
            h: h,
            f: tentativeG + h,
            parent: current
          };
          openList.push(neighborNode);
        }
      }
    }

    // No path found.
    return [];
  }

  /**
   * Heuristic: Manhattan distance.
   */
  private heuristic(p: Point, q: Point): number {
    return Math.abs(p.x - q.x) + Math.abs(p.y - q.y);
  }

  /**
   * Returns true if two points are identical.
   */
  private pointsEqual(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
  }

  /**
   * Returns the node from the list with the lowest f cost.
   */
  private getBestNode(list: Node[]): Node {
    let best = list[0];
    for (const node of list) {
      if (node.f < best.f) {
        best = node;
      }
    }
    return best;
  }

  /**
   * Removes a node from a list.
   */
  private removeFromList(node: Node, list: Node[]): void {
    const idx = list.findIndex((n) => this.pointsEqual(n.point, node.point));
    if (idx !== -1) {
      list.splice(idx, 1);
    }
  }

  /**
   * Searches for a node with the given point in a list.
   */
  private findNode(point: Point, list: Node[]): Node | undefined {
    return list.find((n) => this.pointsEqual(n.point, point));
  }

  /**
   * Reconstructs the path from the given node back to the start.
   */
  private buildRoute(node: Node): Point[] {
    const route: Point[] = [];
    let current: Node | null = node;
    while (current) {
      route.unshift(current.point);
      current = current.parent;
    }
    return route;
  }

  /**
   * Computes the Manhattan distance between two points.
   */
  private distance(p1: Point, p2: Point): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }

  /**
   * Returns candidate points adjacent (axis-aligned) to the given point.
   * This method returns the closest candidate in each direction.
   */
  private getAdjacentPoints(point: Point, candidates: Point[]): Point[] {
    // Get candidates with same x (vertical) and same y (horizontal).
    const sameX = candidates.filter(
      (p) => p.x === point.x && !this.pointsEqual(p, point)
    );
    const sameY = candidates.filter(
      (p) => p.y === point.y && !this.pointsEqual(p, point)
    );

    const adjacent: Point[] = [];
    adjacent.push(...this.findNextPointsInDirection(point, sameY, "x"));
    adjacent.push(...this.findNextPointsInDirection(point, sameX, "y"));
    return adjacent;
  }

  /**
   * Given candidates sharing the same other coordinate,
   * returns the closest candidate before and after the current point along the given axis.
   *
   * For axis "x": returns nearest left and right; for "y": returns nearest above and below.
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
      if (!this.easy && this.lineIntersectsShapes(current, candidate)) {
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

  /**
   * Checks whether the straight (axis-aligned) line between two points intersects either shape.
   */
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

  /**
   * Checks if a point exists in a list of nodes.
   */
  private isPointInNodes(point: Point, list: Node[]): boolean {
    return list.some((n) => this.pointsEqual(n.point, point));
  }
}
