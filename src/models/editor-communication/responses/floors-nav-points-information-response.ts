import type { FloorNavPointsInfo } from "../models/floor-nav-points-info.type"
import type { ResponseType } from "./response-type"

export type FloorsNavPointsInformationResponse = {
    type: ResponseType.FloorsNavPointsInfo,
    data: FloorNavPointsInfo[]
}