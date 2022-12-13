import type { FloorNavPoint } from "./floor-nav-point.type";
import type { FloorShop } from "./floor-shop.type";

export interface FloorInfo{
    id: string;
    modelUrl: string;
    name: string;
    navPoints: FloorNavPoint[];
    shopsNodes: FloorShop[];
}