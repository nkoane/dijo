<script lang="ts">
    export let data;

    const categories = data.categories ?? [];

    console.log(categories['starch']);
</script>

<div class="mb-4 flex justify-between">
    <h2 class="text-2xl font-bold">ORDX</h2>
    <dl class="flex flex-row-reverse gap-2">
        <dt class="font-bold">R0,00</dt>
        <dd>02</dd>
        <dd>03</dd>
        <dd>04</dd>
        <dd>05</dd>
        <dd>06</dd>
    </dl>
</div>

<section class="flex justify-between gap-2">
    <ol class="categories grid gap-2 grid-cols-2 w-full">
        {#each Object.keys(categories) as category (category)}
            <li class="category">
                <p class="uppercase font-bold">{category}</p>
                <ul class="foods">
                    {#each categories[category] as food (food)}
                        <li class="food">
                            <dl>
                                <dt>{food.name}</dt>
                                <dd>{food.cost}</dd>
                            </dl>
                        </li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ol>
</section>
