import type { FloorSaveInfo } from "../models/floor-save-info.type"
import type { RequestType } from "./request-type"

export type FloorSaveInfoRequest = {
    type: RequestType.Save,
    data: FloorSaveInfo
}