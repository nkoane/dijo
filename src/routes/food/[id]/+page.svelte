<script lang="ts">
    import FoodForm from '$lib/forms/FoodForm.svelte';

    export let data;
    export let form;
    const food = data.food;

    $: if (form == null) {
        form = {
            food: food
        };
    }

    console.log('food/id/page.svelte', form);
</script>

<svelte:head>
    <title>dijo . {food.name}</title>
</svelte:head>

<h3>Food</h3>

<dl>
    <dt>{food.name}</dt>
    <dd>{food.description}</dd>
    <dd>{food.cost}</dd>
    <dd><a href="/categories/{food.categoryId}">{food.category.name}</a></dd>
</dl>
<FoodForm {form} categories={data.categories} action="?/edit" />
