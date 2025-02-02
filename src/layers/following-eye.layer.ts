import { Layer } from "../core/layer";
import { FollowingEyes } from "../primitives/detective/following-eyes";
import { SetUpLayer } from "./setup.layer";

export class FollowingEyesLayer implements SetUpLayer {
  public init(): Layer {
    const layer = new Layer();
    layer.add(new FollowingEyes());
    return layer;
  }
}
