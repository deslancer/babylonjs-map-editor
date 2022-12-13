import type { NavPointRelationType } from "./nav-point-relation-type";

export interface FloorNavPointRelation{
    accessibility: boolean;
    linkWeight: number;
    targetNode: string;
    targetFloorId: string;
    type: NavPointRelationType;
}