import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { HighlightLayer } from "@babylonjs/core/";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";

export class Highlight {
    highlightLayer: HighlightLayer;
    private hl_color: Color3 =  Color3.Green()

    constructor(scene: any) {
        this.highlightLayer =  new HighlightLayer( 'hl', scene )
    }
    highlightMesh( mesh: AbstractMesh, color?: Color3 ): void {
        const hl_mesh = mesh as Mesh;
        this.highlightLayer.removeAllMeshes()
        if ( this.highlightLayer.hasMesh(hl_mesh) ){
            this.highlightLayer.removeMesh(hl_mesh)
        }else {
            this.highlightLayer.addMesh( hl_mesh, color ?? this.hl_color  );
        }
    }
    removeHighlighting(mesh: AbstractMesh){
        if ( this.highlightLayer.hasMesh(mesh) ){
            this.highlightLayer.removeMesh(mesh as Mesh)
        }
    }
}
