import { Color3 } from "@babylonjs/core/Maths/math.color";
import { PBRMaterial } from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";

interface IMaterials {
    selectedNodeMat( color?: Color3 | undefined ): PBRMaterial;

    selectedShopMat( color?: Color3 | undefined ): PBRMaterial;

    addedNodeRelMat( color?: Color3 | undefined ): PBRMaterial;

    addedShopRelMat( color?: Color3 | undefined ): PBRMaterial;

    editModeNodesMat( color?: Color3 | undefined ): PBRMaterial;

    defaultNodesMat(): PBRMaterial;
}

export class Materials implements IMaterials {
    private scene: Scene;

    constructor( scene ) {
        this.scene = scene;
    }

    addedNodeRelMat( color: Color3 | undefined ): PBRMaterial {
        const addedNodeMaterial: PBRMaterial = this.scene.getMaterialByName('added_node') as PBRMaterial ?? new PBRMaterial( 'added_node' );
        addedNodeMaterial.albedoColor = color ?? new Color3( 0.0, 0.0, 1.0 )
        addedNodeMaterial.roughness = 1.0;
        return addedNodeMaterial;
    }

    addedShopRelMat( color: Color3 | undefined ): PBRMaterial {

        return undefined;
    }

    defaultNodesMat(): PBRMaterial {
        return this.scene.getMaterialByName( 'markers' ) as PBRMaterial;
    }

    editModeNodesMat( color?: Color3 | undefined ): PBRMaterial {
        const material = this.scene.getMaterialByName('selection_mode') as PBRMaterial ?? new PBRMaterial( 'selection_mode' );
        material.roughness = 1.0;
        material.albedoColor = color ?? new Color3( 1.0, 0.0, 0.0 );
        return material;
    }

    selectedNodeMat( color?: Color3 | undefined ): PBRMaterial {
        const material = this.scene.getMaterialByName('selected_node') as PBRMaterial ?? new PBRMaterial( 'selected_node' );
        material.roughness = 1.0;
        material.albedoColor = color ?? new Color3( 1.0, 0.44, 0.2 );
        return material;
    }

    selectedShopMat( color: Color3 | undefined ): PBRMaterial {

        return undefined;
    }

}