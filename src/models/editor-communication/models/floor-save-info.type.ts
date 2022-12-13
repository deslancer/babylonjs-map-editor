import type { FloorNavPoint } from "./floor-nav-point.type";
import type { FloorShop } from "./floor-shop.type";

export interface FloorSaveInfo{
    navPoints: FloorNavPoint[];
    shopsNodes: FloorShop[];
}