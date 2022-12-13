import type { EditorRequest } from "./requests/editor-request";
import { RequestType } from "./requests/request-type";
import type { EditorResponses } from "./responses/editor-responses";

export class EditorComponetProxy {

    private _disposed = false;
    private readonly _expectedMessageTypes = [ RequestType.FloorInfo, RequestType.FloorsNavPointsInfo, RequestType.Save, RequestType.ShopsList ];
    private readonly _listeners: Set<(( request: EditorRequest ) => void)> = new Set();
    private readonly _onMessageReceivedBinded: ( ev: MessageEvent<any> ) => void;
    private readonly _targetWindow: Window;

    constructor(targetWindow?: Window) {
        this._targetWindow = targetWindow || window;
        this._onMessageReceivedBinded = this.onMessageReceived.bind(this);
        window.addEventListener("message", this._onMessageReceivedBinded);
    }

    public addListener(listener: (request: EditorRequest)=> void): void{
        this._listeners.add(listener);
    }

    public dispose() {
        this.guardAgainsDisposed();
        this._disposed = true;
        window.removeEventListener("message", this._onMessageReceivedBinded);
    }

    public removeListener(listener: (request: EditorRequest)=> void): void{
        this._listeners.delete(listener);
    }

    public sendResponse(response: EditorResponses) {
        this.guardAgainsDisposed();
        this._targetWindow.postMessage(response);
    }

    private guardAgainsDisposed(): void {
        if (!this._disposed) {
            return;
        }

        throw new Error("Object has been disposed");
    }

    private onMessageReceived(ev: MessageEvent<any>) {
        const msg = ev.data as EditorRequest;
        if (!msg?.type || !this._expectedMessageTypes.includes(msg.type)) {
            return;
        }

        this._listeners.forEach(listener => listener(msg))
    }

}