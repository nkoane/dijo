<script lang="ts">
    export let data;

    const orders = data.orders ?? [];

    console.log('kitchen/page.svelte', orders[0].createdAt);
</script>

<h2 class="text-2xl font-bold mb-4">The Kitchen</h2>
<ol>
    {#each orders as order}
        <li class="bg-gray-100 mb-2 flex gap-4 p-2">
            <h3 class="bg-white font-bold px-2">{order.id}</h3>
            <ul class="food-items bg-blue-200 min-w-[30%]">
                {#each order.OrderItems as item}
                    <li class="food-item">
                        <span>{item.quantity} x</span>
                        <span>{item.food.name}</span>
                        <!-- <span>R{item.cost}</span> -->
                    </li>
                {/each}
            </ul>
            <p class=" flex-shrink">{order.createdAt}</p>
            <p class="ml-auto p-2 bg-gray-50">R{order.cost}</p>
            <p class="ml-auto bg-white p-2 text-sm uppercase self-start">
                {order.Status?.state}
            </p>
            <button class="bg-red-50 p-2 text-sm block self-start">PREPARE</button>
        </li>
    {/each}
</ol>
