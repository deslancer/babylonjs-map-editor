import type { FloorNavPointRelation } from "./floor-nav-point-relation.type";

export interface FloorNavPoint{
    attachedShopNode: string|null;
    nodeName: string;
    relations: FloorNavPointRelation[];
}