<script lang="ts">
    import { onMount } from "svelte";
    import { createScene } from "../models/scene";
    import NavPointsTab from "./SidebarComponent/NavPointsTab.svelte";
    import ShopsTab from "./SidebarComponent/ShopsTab.svelte";
    import Sidebar from "./SidebarComponent/Sidebar.svelte";

    export let canvasElement: HTMLCanvasElement;
    let items = [
        {
            label: "Nav. Points",
            value: 1,
            component: NavPointsTab
        },
        {
            label: "Shops",
            value: 2,
            component: ShopsTab
        },
    ];
    onMount( () => {
        createScene( canvasElement );
    } );

</script>
<div class="row">
    <div class="col-9">
        <canvas bind:this={canvasElement}></canvas>
    </div>
    <div class="col-3">
        <Sidebar {items} />
    </div>
</div>

<style>
    canvas {
        width: 100%;
        height: 100vh;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
    }
</style>
