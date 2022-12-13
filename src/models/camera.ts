import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";

export const createMainCamera = (canvas: HTMLCanvasElement, scene: Scene)=>{
    const camera = new ArcRotateCamera(
        "camera",
        2.13,
        Math.PI / 3,
        200,
        new Vector3( 0, 0, 0 ),
        scene
    );
    camera.attachControl( canvas, true );
    camera.target = new Vector3( 35, 0, 22 );
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.lowerRadiusLimit = 100;
    camera.upperRadiusLimit = 300;

    return camera;
}
