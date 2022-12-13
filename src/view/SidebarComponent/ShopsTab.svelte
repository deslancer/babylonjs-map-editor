<script>
    import {map_data} from "../../controllers/store";
    import _ from 'lodash'
    let selected_shop = '';
    let shopsList = [ {} ];
    map_data.subscribe((result)=>{
        if (result){
            shopsList = result.shopNodeNames
        }
    })
</script>
<h4 class="py-2">Shops</h4>
<ul class="list-group">
    {#if shopsList}
        {#each _.orderBy(shopsList, [], ['asc']) as shop}
            <li class:list-active="{selected_shop === shop}"
                on:click="{() => selected_shop = shop}"
                    class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">{shop}</div>
                    Linked to:
                </div>
            </li>
        {/each}
    {/if}
</ul>

<style>
    .list-group {
        height: 75%;
        overflow: scroll;
    }
</style>