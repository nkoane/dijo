<script lang="ts">
    export let data;

    const orders = data.orders ?? [];

    console.log('kitchen', orders[0]);
</script>

<h2 class="text-2xl font-bold">KÖK</h2>
<ol>
    {#each orders as order}
        <li>
            <div class="flex justify-between">
                <div class="flex flex-col">
                    <span class="font-bold">{order.id}</span>
                    <span class="text-sm">{order.Status.state}</span>
                </div>
                <div class="items">
                    {#each order.OrderItems as item}
                        <div class="flex flex-col">
                            <span class="font-bold">{item.cost}</span>
                            <span class="text-sm">{item.quantity}</span>
                        </div>
                    {/each}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm">{order.createdAt}</span>
                </div>
            </div>
        </li>
    {/each}
</ol>
