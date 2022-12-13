import type { RequestType } from "./request-type"

export type FloorsNavPointsInformationRequest = {
    type: RequestType.FloorsNavPointsInfo
    excludeFloor?: string | null;
}