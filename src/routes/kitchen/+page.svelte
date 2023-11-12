<script lang="ts">
    export let data;

    const orders = data.orders ?? [];

    console.log('kitchen', orders[0].OrderItems);
</script>

<h2 class="text-2xl font-bold">KÖK</h2>
<ol>
    {#each orders as order}
        <li class="bg-gray-100 mb-2">
            <div class="flex justify-between gap-2">
                <div class="flex flex-col">
                    <span class="font-bold">{order.id}</span>
                </div>
                <div class="items">
                    {#each order.OrderItems as item}
                        <div class="flex flex-row gap-2 justify-between">
                            <span class="text-sm">{item.quantity} x</span>
                            <span class="text-sm">{item.food.name}</span>
                            <span class="font-bold">R{item.cost}</span>
                        </div>
                    {/each}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm">{order.createdAt}</span>
                    <span class="text-sm">R{order.cost}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-sm uppercase font-bold">{order.Status.state}</span>
                </div>
            </div>
        </li>
    {/each}
</ol>
