<script lang="ts">
    export let data;
    const food = data.food;
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
