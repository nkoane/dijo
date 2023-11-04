<script lang="ts">
    import FoodForm from '$lib/forms/FoodForm.svelte';

    export let data;
    export let form;
    const food = data.food;
    const categories = data.categories;
    const statuses = data.statuses;

    const category = data.categories.find((c) => c.id === food.categoryId);
    const status = data.statuses.find((c) => c.id === food.statusId);

    $: if (form == null) {
        form = {
            food: food
        };
    }
</script>

<svelte:head>
    <title>dijo . {food.name}</title>
</svelte:head>

<div class="flex justify-between gap-4">
    <dl class="w-1/2">
        <dt class="text-xl font-bold">{food.name}</dt>
        <dd>{food.description}</dd>
        <dd>R{food.cost}</dd>
        <dd class="lowercase">
            <a href="/food?category={food.categoryId}">{category?.name}</a> |
            <a href="/food?status={food.statusId}">{status?.state}</a>
        </dd>
    </dl>
    <FoodForm {form} {categories} {statuses} action="?/edit" />
</div>
