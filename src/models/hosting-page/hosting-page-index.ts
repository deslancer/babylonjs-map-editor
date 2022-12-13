import type { ShopInfo } from "../editor-communication/models/shop-info.type";
import { HostingPageSim } from "./hosting-page-sim";

/**
 * Change selectedFloor value with one property name of floorsById
 */
const selectedFloor = "one-test";
/**
 * Define how many number of shops, simuletor retrieve.
 */
const shopsNumber = 25;

const floorsById: {
    [id: string]: {
        modelUrl: string,
        name: string
    }
} = {
    "one-test": {
        /* Change model url */
        modelUrl: "assets/PTA_FLoor_01.gltf",
        name: "First floor",
    },
    "two-test": {
        /* Change model url */
        modelUrl: "assets/PTA_FLoor_01.gltf",
        name: "Second floor",
    },
    "three-test": {
        /* Change model url */
        modelUrl: "assets/PTA_FLoor_01.gltf",
        name: "Third floor",
    }
};

function createShopsList(): readonly ShopInfo[] {
    const shops: ShopInfo[] = [];
    for (let i = 0; i < shopsNumber; i++) {
        const shopNum = i.toString().padStart(3, '0');
        shops.push({
            id: `shopid-${shopNum}`,
            name: `Shop #${shopNum} name`
        });
    }

    return shops;
}


const iframe = document.getElementById("container") as HTMLIFrameElement;
const sim = new HostingPageSim({
    selectedFloorId: selectedFloor,
    floorsById: floorsById,
    shops: createShopsList()
}, iframe);