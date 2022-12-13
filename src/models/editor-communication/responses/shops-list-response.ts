import type { ShopInfo } from "../models/shop-info.type";
import type { ResponseType } from "./response-type"

export type ShopsListResponse = {
    type: ResponseType.ShopsList;
    data: ShopInfo[];
}