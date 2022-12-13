import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import '@babylonjs/loaders';
import "@babylonjs/inspector";
import { AbstractMesh, CubeTexture, EnvironmentHelper, PBRMaterial } from "@babylonjs/core";
import { editablePoint, highlighter, isInEditMode, mainScene, map_data, selected_point } from "../controllers/store";

import { Highlight } from "./highlighter";
import { MapLoader } from "./map-loader";
import type { NavPointInterface } from "./nav-point.interface";
import { ActionsService } from "./actions-service";
import { createMainCamera } from "./camera";
import { EventsService } from "./events-service";


export const createScene = ( canvas ) => {
    const engine = new Engine( canvas, true, { stencil: true } );
    const scene = new Scene( engine );
    scene.clearColor = new Color4( 0.0, 0.0, 0.0, 0.0 ) //scene background color

    const hl = new Highlight( scene );
    const actions = new ActionsService(scene, hl);
    const events = new EventsService(scene, actions);

    const camera = createMainCamera(canvas, scene)
    const hdrTexture =  CubeTexture.CreateFromPrefilteredData("./assets/environment/royal_esplanade.env", scene);
    scene.environmentTexture = hdrTexture;
    hdrTexture.level = 1.0;

    new EnvironmentHelper({
        skyboxSize: 0
    }, scene)

    const loader = new MapLoader()
    loader.loadAsync( './assets/meshes/PTA_FLoor_01.gltf', scene ).then( ( result ) => {
        map_data.set( result );
        isInEditMode.subscribe( ( inMode ) => {
            events.onChangeEditMode(inMode, result)
        })
        events.registerActionManager(scene.meshes)
        events.registerAllEvents();
    } )


    engine.runRenderLoop( () => {
        scene.render();
    } );

    window.addEventListener( 'resize', () => {
        engine.resize();
    } );
    mainScene.update( () => {
        return scene;
    } )
    highlighter.update( () => {
        return hl;
    } )
    document.onkeyup = function ( e ) {
        const evt = window.event || e;
        //console.log(evt.keyCode);
        // @ts-ignore
        if ( evt.keyCode === 73 && evt.ctrlKey && evt.altKey ) {
            if ( scene.debugLayer.isVisible() ) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show( {
                    globalRoot: document.body,
                    overlay: true,
                } );
            }
        }
    };
    return scene;
}