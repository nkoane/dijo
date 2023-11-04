<script lang="ts">
    import FoodForm from '$lib/forms/FoodForm.svelte';

    export let data;
    export let form;
    const food = data.food;

    const category = data.categories.find((c) => c.id === food.categoryId);

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
        <dd>{food.cost}</dd>
        <dd><a href="/food?category={food.categoryId}">{category?.name}</a></dd>
    </dl>
    <FoodForm {form} categories={data.categories} action="?/edit" />
</div>
