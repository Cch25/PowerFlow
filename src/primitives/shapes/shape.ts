import { EventEmitter, ShapeEventMap } from "../../core/event-emitter";
import { ViewPort } from "../../viewport";

export abstract class Shape extends EventEmitter<ShapeEventMap> {
  abstract draw(viewPort: ViewPort): void;
}
