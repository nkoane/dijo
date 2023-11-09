<script lang="ts">
    import type { OrderStatus } from '@prisma/client';

    export let data;

    const categories = data.categories ?? [];
    const status = data.status ?? [];
    const foods = data.foods ?? [];

    type OrderItem = {
        id: number;
        quantity: number;
        cost: number;
    };

    let order: { items: OrderItem[]; status: OrderStatus; total: number } = {
        items: [],
        status: status.find((status) => status.state === 'pending') ?? status[0],
        total: 0
    };

    console.log(order);

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

    const makePayment = async () => {
        if (order.items.length === 0) return;

        order.status = status.find((status) => status.state === 'paid') ?? status[0];
        console.log(order.status.state);
    };

    const placeOrder = async () => {
        if (order.items.length === 0) return;
        console.log('place order in the db, and send a message to the kitchen');
    };
</script>

<div class="mb-4 flex justify-between">
    <h2 class="text-2xl font-bold">ORDX</h2>
    <div class="order flex flex-row-reverse gap-2 items-center">
        {#if order.items.length > 0}
            {#if order.status.state.toLocaleLowerCase() == 'pending'}
                <p><button on:click={makePayment} class="order-button">PAY</button></p>
            {:else}
                <p><button on:click={placeOrder} class="order-button">ORDER</button></p>
            {/if}
            <p class="total font-bold">{order.total.toFixed(2)}</p>
            <p>
                <span class="items">
                    [{order.items.length}]
                </span>
                {#each order.items as item (item.id)}
                    <span class="item">
                        {item.quantity}x {item.cost.toFixed(2)}
                    </span>
                {/each}
            </p>
        {/if}
    </div>
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

    .order button {
        background-color: #f56565;
        color: #fff;
        border: 0;
        border-radius: 0.25rem;
        @apply font-bold py-1 px-2;
    }
</style>
