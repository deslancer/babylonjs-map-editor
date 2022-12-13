import type { FloorInfo } from "../models/floor-info.type"
import type { ResponseType } from "./response-type"

export type FloorInformationResponse = {
    type: ResponseType.FloorInformation,
    data: FloorInfo
}