import { ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { ActionsService } from "./actions-service";
import type { MapInfo } from "./map-loader";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Materials } from "./materials";
import { editablePoint, isInEditMode, map_data } from "../controllers/store";
import type { NavPointInterface } from "./nav-point.interface";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

interface IEventsService {
    actionManager: ActionManager;

    handleLeftClick(): void;

    handleRightClick(): void;

    handlePointerOver(): void;

    handlePointerOut(): void;

    handleDoubleClick(): void;

    onChangeEditMode( inMode: boolean, data: MapInfo ): void;

    handleRemoveNode(): void;
}

export class EventsService implements IEventsService {
    actionManager: ActionManager;
    private actionsService: ActionsService;
    private readonly materials: Materials;
    private readonly scene: Scene;
    constructor( scene: Scene, actions: ActionsService ) {
        this.actionManager = new ActionManager( scene );
        this.actionsService = actions;
        this.materials = new Materials( scene )
        this.scene = scene;
    }

    handleDoubleClick(): void {
        this.actionManager.registerAction( (new ExecuteCodeAction( ActionManager.OnDoublePickTrigger, ( evt ) => {
            const mesh = evt.meshUnderPointer;

        } )) )
    }

    handleLeftClick(): void {
        this.actionManager.registerAction( (new ExecuteCodeAction( ActionManager.OnLeftPickTrigger, ( evt ) => {
            const mesh = evt.meshUnderPointer;
            if ( mesh.name.includes("Nav") ){
                isInEditMode.subscribe((inMode)=>{
                    if ( inMode ){
                        this.actionsService.addNode(mesh);
                    }else {
                        this.actionsService.selectNode(mesh);
                    }
                })
            }

        } )) )
    }

    handlePointerOut(): void {
        this.actionManager.registerAction( (new ExecuteCodeAction( ActionManager.OnPointerOverTrigger, ( evt ) => {
            const mesh = evt.meshUnderPointer;
            if(mesh.name.includes("Nav")){
                this.actionsService.removeHighlighting( mesh )
            }
        } )) )
    }

    handlePointerOver(): void {
        this.actionManager.registerAction( (new ExecuteCodeAction( ActionManager.OnPointerOverTrigger, ( evt ) => {
            const mesh = evt.meshUnderPointer;
            if(mesh.name.includes("Nav")){
                this.actionsService.addHighlighting( mesh )
            }
        } )) )
    }

    handleRightClick(): void {
    }

    onChangeEditMode( inMode, result: MapInfo ): void {
        if ( inMode ) {
            const camera = this.scene.activeCamera as ArcRotateCamera
            for ( const [ name, point ] of Object.entries( result.navPoints ) ) {
                editablePoint.subscribe( ( node: NavPointInterface ) => {
                   if ( point.name === node.nodeName ){
                       point.material = this.materials.selectedNodeMat();
                       camera.setTarget(point);
                       camera.radius = 100;
                   }
                } )
                //point.material = this.materials.editModeNodesMat( new Color3( 1.0, 0.0, 0.0 ) );
            }
        } else {
            for ( const [ name, point ] of Object.entries( result.navPoints ) ) {
                point.material = this.materials.defaultNodesMat();
            }
        }
    }

    registerActionManager( meshes: Array<AbstractMesh> ) {
        meshes.map( ( mesh ) => {
            mesh.actionManager = this.actionManager;
        } )
    }

    registerAllEvents(): void {
        this.handleLeftClick();
        this.handleDoubleClick();
        this.handlePointerOut();
        this.handlePointerOver();
        this.handleRemoveNode();
    }

    handleRemoveNode(): void {
        (document as any).remove_event = new Event('remove_node')
        document.addEventListener('remove_node', (e)=>{
            this.actionsService.removeNode()
        }, false)
    }
}