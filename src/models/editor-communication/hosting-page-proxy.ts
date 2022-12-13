import type { FloorInfo } from "./models/floor-info.type";
import type { FloorNavPointsInfo } from "./models/floor-nav-points-info.type";
import type { FloorSaveInfo } from "./models/floor-save-info.type";
import type { ShopInfo } from "./models/shop-info.type";
import type { EditorRequest } from "./requests/editor-request";
import { RequestType } from "./requests/request-type";
import type { EditorResponses } from "./responses/editor-responses";
import type { FloorInformationResponse } from "./responses/floor-information-response";
import type { FloorsNavPointsInformationResponse } from "./responses/floors-nav-points-information-response";
import { ResponseType } from "./responses/response-type";
import type { ShopsListResponse } from "./responses/shops-list-response";

export class HostingPageProxy {
    constructor() {
        this._targetWindow = window.parent || window;
        this._onMessageReceivedBinded = this.onMessageReceived.bind(this);
        window.addEventListener("message", this._onMessageReceivedBinded);
    }

    public dispose() {
        this.guardAgainsDisposed();
        this._disposed = true;
        window.removeEventListener("message", this._onMessageReceivedBinded);
        if (this._responsePromiseRejecter) {
            this._responsePromiseRejecter("Object disposed");
        }
    }

    public async requestFloorInfoAsync(): Promise<FloorInfo> {
        this.guardAgainsDisposed();
        const response = await this.waitForResponseAsync({ type: RequestType.FloorInfo }) as FloorInformationResponse;

        if (response.type != ResponseType.FloorInformation) {
            throw new Error(`Unexpected response type: ${response.type}`);
        }

        return response.data;
    }

    public requestSaveData(floorInfo: FloorSaveInfo) {
        this.guardAgainsDisposed();
        this.guardAgainstConcurrentRequest();

        this.sendRequest({ type: RequestType.Save, data: floorInfo });
    }

    public async requestFloorsNavPointsAsync(excludedFloor?: string): Promise<FloorNavPointsInfo[]> {
        this.guardAgainsDisposed();
        const response = await this.waitForResponseAsync({
            type: RequestType.FloorsNavPointsInfo,
            excludeFloor: excludedFloor
        }) as FloorsNavPointsInformationResponse;

        if (response.type != ResponseType.FloorsNavPointsInfo) {
            throw new Error(`Unexpected response type: ${response.type}`);
        }

        return response.data;
    }

    public async requestShopsListAsync(): Promise<ShopInfo[]> {
        this.guardAgainsDisposed();
        const response = await this.waitForResponseAsync({ type: RequestType.ShopsList }) as ShopsListResponse;

        if (response.type != ResponseType.ShopsList) {
            throw new Error(`Unexpected response type: ${response.type}`);
        }

        return response.data;
    }

    private _disposed = false;
    private readonly _expectedMessageTypes = [ResponseType.FloorInformation, ResponseType.FloorsNavPointsInfo, ResponseType.ShopsList];
    private readonly _onMessageReceivedBinded: (ev: MessageEvent<any>) => void;
    private _responsePromise: Promise<EditorResponses> | null = null;
    private _responsePromiseRejecter: ((reason: any) => void) | null = null ;
    private _responsePromiseResolver: ((response: EditorResponses) => void) | null = null;
    private readonly _targetWindow: Window;

    private guardAgainsDisposed(): void {
        if (!this._disposed) {
            return;
        }

        throw new Error("Object has been disposed");
    }

    private guardAgainstConcurrentRequest() {
        if (this._responsePromise) {
            throw new Error("");
        }
    }

    private onMessageReceived(ev: MessageEvent<any>) {
        const msg = ev.data as EditorResponses;
        if (!msg?.type || !this._expectedMessageTypes.includes(msg.type)) {
            return;
        }

        if (!this._responsePromiseResolver) {
            console.warn(`Unexpected response: ${msg.type}`);
            return;
        }

        this._responsePromiseResolver(msg);
    }

    private sendRequest(request: EditorRequest): void {
        this._targetWindow.postMessage(request);
    }

    private async waitForResponseAsync(request: EditorRequest): Promise<EditorResponses> {
        this.guardAgainstConcurrentRequest();

        this._responsePromise = new Promise((resolve, reject) => {
            this._responsePromiseResolver = resolve;
            this._responsePromiseRejecter = reject;
        });

        this.sendRequest(request);

        try {
            return await this._responsePromise;
        } catch (e) {
            throw e;
        } finally {
            this._responsePromiseResolver = null;
            this._responsePromiseRejecter = null;
            this._responsePromise = null;
        }
    }
}