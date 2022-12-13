<script>
    import {
        map_data,
        mainScene,
        selected_point,
        highlighter,
        isInEditMode, editablePoint, removedRelNodesList
    } from "../../controllers/store";
    import _ from 'lodash'
    import {beforeUpdate} from "svelte";

    let selected_node = '';
    let scene;
    let hl;
    let isEditMode;
    let nodesList = [{}];

    map_data.subscribe((result) => {
        if (result) {
            nodesList = result.navPointNodeNames
        }
    })
    mainScene.subscribe((result) => {
        scene = result;
    })
    highlighter.subscribe((result) => {
        hl = result;
    })

    beforeUpdate(() => {
        selected_point.subscribe((result) => {
            selected_node = result;
        })
    })

    function selectNode(point) {
        selected_point.update(() => {
            return point.nodeName;
        })
        selected_node = point.nodeName;
        if (scene && hl) {
            const mesh = scene.getMeshByName(point.nodeName);
            scene.activeCamera.setTarget(mesh);
            hl.highlightMesh(mesh)
        }
    }

    function editNode(point) {
        console.log(point)
        isEditMode = true;
        editablePoint.update(() => {
            return point;
        })
        isInEditMode.update(() => {
            return true
        })
    }

    function closeEditMode() {
        isEditMode = false;
        isInEditMode.update(() => {
            return false;
        })
    }

    function removeNodeRelation(current, index) {
        console.log(current)
        $editablePoint.relations.splice(index, 1);
        $editablePoint.relations = $editablePoint.relations;
        document.dispatchEvent(document.remove_event)
        $removedRelNodesList = [...$removedRelNodesList, current]

    }
</script>

{#if isEditMode && $editablePoint}
    <div class="d-flex justify-content-between border-bottom">
        <h4>{$editablePoint.nodeName}</h4>
        <p class="close-mode" on:click={()=> closeEditMode()}>
            <svg width="24px" height="24px" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <path class="clr-i-outline clr-i-outline-path-1"
                      d="m19.41 18 8.29-8.29a1 1 0 0 0-1.41-1.41l-8.29 8.29-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29-8.3 8.29a1 1 0 1 0 1.41 1.41l8.3-8.29 8.29 8.29a1 1 0 0 0 1.41-1.41z"/>
            </svg>
        </p>
    </div>
{:else }
    <h4 class="py-2">
        Nav Points
    </h4>
{/if}
{#if isEditMode && $editablePoint}
    <div class="edit-mode">
        <p class="my-4 py-2 border-bottom">Shop: {$editablePoint.attachedShopNode}</p>
        <h6>Connected Nodes:</h6>
        <ul class="list-group">
            {#each $editablePoint.relations as node, index}
                <li data-node={node} class="list-group-item d-flex justify-content-between align-items-start">
                    <div class="fw-bold">{node.targetNode}</div>
                    <div on:click={()=>{removeNodeRelation(node, index)}} class="delete-connection">
                        <svg width="22px" height="22px" viewBox="0 0 330 330" xml:space="preserve"
                             xmlns="http://www.w3.org/2000/svg">
                        <g fill="#ff0000">
                            <path d="m281.63 48.328c-31.164-31.165-72.599-48.328-116.67-48.328s-85.508 17.163-116.67 48.328c-64.333 64.334-64.333 169.01 0 233.34 31.164 31.164 72.599 48.327 116.67 48.327 44.073 0 85.507-17.163 116.67-48.328 31.165-31.164 48.328-72.599 48.328-116.67s-17.163-85.508-48.328-116.67zm-21.213 212.13c-25.498 25.497-59.399 39.54-95.458 39.54-36.06 0-69.961-14.043-95.46-39.54-52.636-52.637-52.636-138.28 0-190.92 25.498-25.499 59.399-39.541 95.459-39.541s69.961 14.042 95.459 39.54c25.498 25.499 39.541 59.4 39.541 95.46s-14.043 69.961-39.541 95.46z"/>
                            <path d="m254.96 150h-180c-8.284 0-15 6.716-15 15s6.716 15 15 15h180c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/>
                        </g>
                    </svg>
                    </div>
                </li>
            {/each}
        </ul>
        {#if $editablePoint.relations.length === 0}
            <div class="alert alert-secondary" role="alert">
                <span class="text-muted">For add connections just click on nav point on 3d view</span>
            </div>
        {/if}
    </div>
{:else }
    <ul class="list-group">
        {#if nodesList}
            {#each _.orderBy(nodesList, ['nodeName'], ['asc']) as point}
                <li id={point.nodeName} class:list-active="{selected_node === point.nodeName}"
                    on:click="{() => selectNode(point)}"
                    class="list-group-item align-items-center justify-content-between d-flex ">
                    <div class="node-name">
                <span on:click={()=> editNode(point)} class="me-2 edit-btn">
                    <svg width="24px" height="24px" viewBox="0 0 494.94 494.94"
                         xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                        <path d="m389.84 182.85c-6.743 0-12.21 5.467-12.21 12.21v222.97c0 23.562-19.174 42.735-42.736 42.735h-267.74c-23.562 0-42.736-19.174-42.736-42.735v-267.74c0-23.562 19.174-42.735 42.736-42.735h267.74c6.743 0 12.21-5.467 12.21-12.21s-5.467-12.21-12.21-12.21h-267.74c-37.031 0-67.157 30.125-67.157 67.155v267.74c0 37.029 30.126 67.155 67.157 67.155h267.74c37.03 0 67.156-30.126 67.156-67.155v-222.97c0-6.743-5.467-12.211-12.21-12.211z"/>
                        <path d="m483.88 20.791c-14.72-14.72-38.669-14.714-53.377 0l-209.15 209.15c-0.28 0.28-3.434 3.559-4.251 5.396l-28.963 65.069c-2.057 4.619-1.056 10.027 2.521 13.6 2.337 2.336 5.461 3.576 8.639 3.576 1.675 0 3.362-0.346 4.96-1.057l65.07-28.963c1.83-0.815 5.114-3.97 5.396-4.25l209.15-209.15c7.131-7.131 11.06-16.61 11.06-26.692 0-10.081-3.929-19.562-11.06-26.686zm-17.266 36.106-209.15 209.15c-0.035 0.036-0.055 0.078-0.089 0.107l-33.989 15.131 15.131-33.988c0.03-0.036 0.071-0.055 0.107-0.09l209.15-209.15c5.038-5.039 13.819-5.033 18.846 5e-3 2.518 2.51 3.905 5.855 3.905 9.414s-1.389 6.903-3.906 9.42z"/>
                    </svg>
                </span>
                        {point.nodeName}
                    </div>
                    <div>
                        <p>connections:
                            {#if point.relations}
                                <span class="badge rounded-pill mx-3 text-bg-primary">{point.relations.length}</span>
                            {/if}
                        </p>
                        <p>shop: {point.attachedShopNode}</p>
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
{/if}

<style>
    .close-mode {
        cursor: pointer;
        transition: all 400ms ease-in-out;
    }

    .node-name {
        font-weight: 500;
    }

    .edit-btn {
        cursor: pointer;
    }

    .list-group {
        height: 95%;
        overflow: scroll;
    }

    .edit-mode {
        padding: 15px;
    }

    .delete-connection {
        cursor: pointer;
    }
</style>