<script lang="ts">
    export let data;
</script>

<svelte:head><title>dijo . food</title></svelte:head>

<div class="flex justify-between mb-4 border-b-2 border-blue-300 pb-4">
    <h3 class="font-bold text-xl uppercase"><a href="/food">Food</a></h3>
    <nav>
        {#each data.categories as category, idx}
            <a href="/food?category={category.id}">{category.name}</a>
        {/each}
    </nav>
</div>
<slot />
