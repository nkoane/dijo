<script lang="ts">
    import Food from '$lib/forms/FoodForm.svelte';
    export let data, form;
    let foods = data.foods;
    let categories = data.categories;
    let statuses = data.statuses;

    $: foods = data.foods;
</script>

<main class="md:flex gap-2">
    {#if foods.length > 0}
        <ol class=" list-decimal ml-4 w-2/4">
            {#each foods as food (food.id)}
                <li>
                    <a href="/food/{food.id}">{food.name}</a>
                    <span>R{food.cost}</span>
                    <a href="/food?category={food.categoryId}"
                        >{categories.find((c) => c.id === food.categoryId)?.name}</a>
                    <a href="/food?status={food.statusId}"
                        >{statuses.find((c) => c.id === food.statusId)?.state}</a>
                </li>
            {/each}
        </ol>
    {/if}
    <Food {form} {categories} {statuses} />
</main>
