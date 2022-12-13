import type { Scene } from "@babylonjs/core/scene";
import type { AbstractMesh } from "@babylonjs/core";
import { editablePoint, isInEditMode, removedRelNodesList, selected_point } from "../controllers/store";
import type { NavPointInterface } from "./nav-point.interface";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Materials } from "./materials";
import _ from "lodash";


interface IActionsService {
    selectNode(mesh: AbstractMesh): void;

    addNode(mesh: AbstractMesh): void;

    removeNode(): void;

    selectShop(mesh: AbstractMesh): void;

    addShop(mesh: AbstractMesh): void;

    removeShop(mesh: AbstractMesh): void;

    addHighlighting( mesh: AbstractMesh ): void;

    removeHighlighting( mesh: AbstractMesh ): void;


}

export class ActionsService implements IActionsService {
    private readonly scene: Scene;
    private readonly hl;
    private readonly materials: Materials;

    constructor( scene: Scene, highlight ) {
        this.scene = scene;
        this.hl = highlight;
        this.materials = new Materials( this.scene )
    }

    addNode(mesh: AbstractMesh): void {
            let node;

            let nodeRelation = {
                accessibility: false,
                linkWeight: 0,
                targetNode: mesh.name,
                targetfloorId: "1",
                type: "default",
                mesh: mesh
            }
            editablePoint.subscribe( ( point: NavPointInterface ) => {
                node = point;
            } )
            if ( node ) {

                node.relations.push( nodeRelation )
                node.relations =  _.uniqWith(node.relations, _.isEqual)
                mesh.material = this.materials.addedNodeRelMat( new Color3( 0.0, 0.0, 1.0 ) );
            }

            editablePoint.update( () => {
                console.log(node)
                return node
            } )

    }

    addShop(mesh: AbstractMesh): void {
        if ( mesh.name.includes( 'Shop' ) ) {
            this.hl.highlightMesh( mesh, new Color3( 0.0, 0.35, 0.65 ) )
            selected_point.update( () => {
                return mesh.name
            } )
        }
    }

    removeNode(): void {

        removedRelNodesList.subscribe( ( nodes: Array<any> ) => {
            nodes.map((node)=>{
                const mesh = this.scene.getMeshByName(node.targetNode);
                mesh.material = this.materials.defaultNodesMat();
            })
        } )

    }

    removeShop(mesh: AbstractMesh): void {
    }

    addHighlighting( mesh: AbstractMesh ) {
        if ( mesh ) {
            this.hl.highlightMesh( mesh )
        }
    }

    removeHighlighting( mesh: AbstractMesh ): void {
        if ( mesh ) {
            this.hl.removeHighlighting( mesh )
        }
    }


    selectNode(mesh: AbstractMesh): void {

            this.scene.meshes.map((mesh)=>{
                if ( mesh.name.includes("Nav") ){
                    mesh.material = this.materials.defaultNodesMat();
                }
            })
            mesh.material = this.materials.selectedNodeMat();

            selected_point.update( () => {
                return mesh.name
            } )
            document.getElementById( mesh.name ).scrollIntoView( { behavior: "smooth", block: "center" } )

    }

    selectShop(mesh: AbstractMesh): void {

    }


}