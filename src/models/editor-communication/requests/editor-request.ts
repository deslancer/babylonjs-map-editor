import type { FloorInformationRequest } from "./floor-information-request";
import type { FloorSaveInfoRequest } from "./floor-save-info-request";
import type { FloorsNavPointsInformationRequest } from "./floors-nav-points-information-request";
import type { ShopsListRequest } from "./shops-list-request";

export type EditorRequest = FloorInformationRequest | FloorSaveInfoRequest | FloorsNavPointsInformationRequest | ShopsListRequest;