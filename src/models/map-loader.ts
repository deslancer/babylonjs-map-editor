import type { Scene } from "@babylonjs/core/scene";
import { ISceneLoaderAsyncResult, SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import type { NavPointInterface } from "./nav-point.interface";

import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/loaders/glTF";


export interface MapLoaderOptions {
    /**
     * Scale loaded map of this value. Default: 0.01
     */
    readonly mapScale?: number;
    /**
     * NavPoint Nodes name prefix. Default: Navpoint_
     */
    readonly navPointNodePrefix?: string;
    /**
     * NavPoint Nodes name prefix. Default: Shop_
     */
    readonly shopNodePrefix?: string;
}

export interface MapInfo {
    /**
     * Dictionary of all navpoints meshes indexed by their name
     */
    readonly navPoints: { [name: string]: AbstractMesh };
    /**
     * Node containing all nav point nodes
     */
    readonly navPointsContainer: TransformNode;
    /**
     * Navpoint node names
     */
    readonly navPointNodeNames:  Array<NavPointInterface>;
    /**
         * Node containing all map nodes
         */
    readonly rootContainer: TransformNode;
    /**
     * Dictionary of all shops meshes indexed by their name
     */
    readonly shops: { [name: string]: AbstractMesh };
    /**
    * Node containing all nav point nodes
    */
    readonly shopsContainer: TransformNode;
    /**
     * Shop node names
     */
     readonly shopNodeNames: readonly string[];
}

export class MapLoader {
    public constructor(options?: MapLoaderOptions) {
        this._options = this.prepareOptions(options);
    }

    public async loadAsync(url: string, scene: Scene): Promise<MapInfo> {
        const rootContainer = new TransformNode("RootNode", scene);
        const navPointsContainer = new TransformNode("NavPointsContainer", scene)
        navPointsContainer.setParent(rootContainer);

        const shopsContainer = new TransformNode("ShopsContainer", scene)
        shopsContainer.setParent(rootContainer);

        const importResult = await this.importMapAsync(url, scene);


        const navPoints: { [name: string]: AbstractMesh } = {};
        const navPointNodeNames: Array<NavPointInterface> = [];
        
        const shops: { [name: string]: AbstractMesh } = {};
        const shopNodeNames: string[] = [];

        importResult.meshes.forEach(mesh => {
            if (mesh.name.startsWith(this._options.navPointNodePrefix)) {
                mesh.setParent(navPointsContainer);
                navPoints[mesh.name] = mesh;
                navPointNodeNames.push({
                    attachedShopNode: "",
                    nodeName: mesh.name,
                    relations: []
                });
            } else if (mesh.name.startsWith(this._options.shopNodePrefix)) {
                mesh.setParent(shopsContainer);
                shops[mesh.name] = mesh;
                shopNodeNames.push(mesh.name);
            } else {
                mesh.setParent(rootContainer);
            }
        });

        rootContainer.scaling.scaleInPlace(this._options.mapScale);

        return {
            navPoints,
            navPointsContainer,
            navPointNodeNames,
            rootContainer,
            shops,
            shopsContainer,
            shopNodeNames
        }
    }

    private readonly _options: Required<MapLoaderOptions>;



    private async importMapAsync(url: string, scene: Scene): Promise<ISceneLoaderAsyncResult> {
        const lastIndex = url.lastIndexOf('/') + 1;
        return await SceneLoader.ImportMeshAsync(null, url.substring(0, lastIndex), url.substring(lastIndex), scene);
    }

    private prepareOptions(options?: MapLoaderOptions): Required<MapLoaderOptions> {
        return {
            mapScale: options?.mapScale || 0.01,
            navPointNodePrefix: options?.navPointNodePrefix || "Navpoint_",
            shopNodePrefix: options?.shopNodePrefix || "Shop_"
        };
    }
}