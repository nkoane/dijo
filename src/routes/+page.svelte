<script lang="ts">
    import { error, fail } from '@sveltejs/kit';

    export let data;

    const categories = data.categories ?? [];
    const foods = data.foods ?? [];

    type OrderItem = {
        id: number;
        quantity: number;
        cost: number;
    };

    let order: { items: OrderItem[]; total: number } = {
        items: [],
        total: 0
    };

    function addItem(foodId: number) {
        const food = foods.find((food) => food.id === foodId);
        if (!food) return;

        if (order.items.find((item) => item.id === foodId)) {
            order.items = order.items.map((item) => {
                if (item.id === foodId) {
                    item.quantity++;
                    item.cost = item.quantity * food.cost;
                }
                return item;
            });
        } else {
            order.items.push({
                id: foodId,
                quantity: 1,
                cost: food.cost
            });
        }
        order.items = order.items;
    }

    $: order.total = order.items.reduce((total, item) => total + item.cost, 0);
</script>

<div class="mb-4 flex justify-between">
    <h2 class="text-2xl font-bold">ORDX</h2>
    <dl class="order flex flex-row-reverse gap-2">
        <dt class="total font-bold">{order.total.toFixed(2)}</dt>
        {#if order.items.length > 0}
            <dd class="items">
                [{order.items.length}]
            </dd>
            {#each order.items as item (item.id)}
                <dd class="item">
                    {item.quantity}x {item.cost.toFixed(2)}
                </dd>
            {/each}
        {/if}
    </dl>
</div>

<section class="flex justify-between gap-2">
    <ol class="categories grid gap-2 grid-cols-2 w-full">
        {#each Object.keys(categories) as category (category)}
            <li class="category border-2 p-2">
                <ul class="category-foods bg-yellow-50 grid grid-cols-2 gap-2 h-36">
                    {#each categories[category] as food (food)}
                        <li
                            class="food bg-yellow-100 place-items-center grid aspet active:bg-red-100">
                            <button
                                class="w-full h-full"
                                on:click={() => {
                                    addItem(food.id);
                                }}>
                                <dl class="food">
                                    <dt>{food.name}</dt>
                                    <dd class="font-bold">R{food.cost}</dd>
                                </dl>
                            </button>
                        </li>
                    {/each}
                </ul>
                <h2 class="category-name uppercase font-bold mt-2">{category}</h2>
            </li>
        {/each}
    </ol>
</section>

<style lang="postcss">
    .order .total::before {
        content: 'R';
    }
</style>
