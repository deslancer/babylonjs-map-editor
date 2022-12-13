import { EditorComponetProxy } from "../editor-communication/editor-component-proxy";
import type { FloorNavPoint } from "../editor-communication/models/floor-nav-point.type";
import type { FloorNavPointsInfo } from "../editor-communication/models/floor-nav-points-info.type";
import type { FloorSaveInfo } from "../editor-communication/models/floor-save-info.type";
import type { FloorShop } from "../editor-communication/models/floor-shop.type";
import type { ShopInfo } from "../editor-communication/models/shop-info.type";
import type { EditorRequest } from "../editor-communication/requests/editor-request";
import { RequestType } from "../editor-communication/requests/request-type";
import { ResponseType } from "../editor-communication/responses/response-type";

export interface HostingPageConfig {
    readonly selectedFloorId: string;
    readonly floorsById: {
        [id: string]: {
            modelUrl: string,
            name: string
        }
    };
    readonly shops: readonly ShopInfo[];
}

export class HostingPageSim {
    constructor(config: HostingPageConfig, hostingIFrame?: HTMLIFrameElement) {
        this._config = config;
        this._component = new EditorComponetProxy(hostingIFrame?.contentWindow || undefined);
        this._component.addListener((request) => this.onRequestReceived(request));
    }

    private loadFloorInfo(selectedFloorId: string): SavedFloor | null {
        const serialized = localStorage.getItem(this._localStorageKey);
        if (!serialized) {
            return null;
        }

        const floors = JSON.parse(serialized) as SavedFloors;
        return floors[selectedFloorId] || null;

    }

    private onRequestReceived(request: EditorRequest): void {
        switch (request.type) {
            case RequestType.FloorInfo:
                this.sendFloorInfo();
                break;
            case RequestType.FloorsNavPointsInfo:
                this.sendFloorsNavPoints(request.excludeFloor);
                break;
            case RequestType.Save:
                this.saveFloorInfo(request.data)
                break;
            case RequestType.ShopsList:
                this.sendShopsList();
                break;
        }
    }

    private saveFloorInfo(floorInfo: FloorSaveInfo) {
        let serialized = localStorage.getItem(this._localStorageKey);
        const floors: SavedFloors = serialized
            ? JSON.parse(serialized)
            : {};

        floors[this._config.selectedFloorId] = {
            navPoint: floorInfo.navPoints,
            shopsNodes: floorInfo.shopsNodes
        };

        serialized = JSON.stringify(floors);
        localStorage.setItem(this._localStorageKey, serialized);
    }

    private sendFloorInfo() {
        const floor = this._config.floorsById[this._config.selectedFloorId];
        if (!floor) {
            throw new Error(`Floor not found: ${this._config.selectedFloorId}`);
        }

        const savedFloorInfo = this.loadFloorInfo(this._config.selectedFloorId);

        this._component.sendResponse({
            type: ResponseType.FloorInformation,
            data: {
                id: this._config.selectedFloorId,
                modelUrl: floor.modelUrl,
                name: floor.name,
                navPoints: savedFloorInfo?.navPoint || [],
                shopsNodes: savedFloorInfo?.shopsNodes || []
            }
        });
    }

    private sendFloorsNavPoints(excludeFloor?: string | null) {

        const floors = Object.keys(this._config.floorsById).filter(floorId => floorId != excludeFloor).map(floorId => {
            const savedFloor = this.loadFloorInfo(floorId);
            const floor = this._config.floorsById[floorId];
            return {
                id: floorId,
                name: floor.name,
                navPoints: savedFloor?.navPoint.map(np => np.nodeName) || []
            } as FloorNavPointsInfo;
        }) as FloorNavPointsInfo[];

        this._component.sendResponse({
            type: ResponseType.FloorsNavPointsInfo,
            data: floors
        });
    }

    private sendShopsList() {
        this._component.sendResponse({
            type: ResponseType.ShopsList,
            data: this._config.shops as ShopInfo[]
        });
    }

    private readonly _component: EditorComponetProxy;
    private readonly _config: HostingPageConfig;
    private readonly _localStorageKey = "pta.test.data";
}

interface SavedFloor {
    navPoint: FloorNavPoint[];
    shopsNodes: FloorShop[];
}

interface SavedFloors {
    [id: string]: SavedFloor;
}