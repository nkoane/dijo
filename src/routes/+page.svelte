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
            <li class="category border-2 p-2">
                <ul class="category-foods bg-yellow-50 grid grid-cols-2 gap-2 h-36">
                    {#each categories[category] as food (food)}
                        <li class="food bg-yellow-100 place-items-center grid">
                            <dl class="food">
                                <dt>{food.name}</dt>
                                <dd class="font-bold">R{food.cost}</dd>
                            </dl>
                        </li>
                    {/each}
                </ul>
                <h2 class="category-name uppercase font-bold mt-2">{category}</h2>
            </li>
        {/each}
    </ol>
</section>
