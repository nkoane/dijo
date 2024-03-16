<script lang="ts">
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data;
	const { user, orders } = data;
	const numberOfOrders = Object.keys(orders).reduce((acc, key) => acc + orders[key].length, 0);

	/*Object.keys(orders).forEach((key) => {
		console.log('order-by-type:', key, orders[key].length);
	});
	*/

	onMount(() => {
		const socket = io();

		// TODO: remove this
		socket.on('testMessage', (message) => {
			console.log('testMessage', message);
		});
		/*
		socket.on('kitchen-order-new', (order) => {
			toast.success(`new: ${order.orderNumber} x ${order.OrderItems.length} items -> ${socket.id}`);
			// orders = [...orders, order];
		});
		*/

		return () => {
			socket.disconnect();
		};
	});

	// $: console.log('(app)/kitchen/page.svelte -> orders:', data.orders);
</script>

<h2>Kitchen, {data.user?.username}: {data.user?.roleId}.</h2>

<h3>Orders: {numberOfOrders}</h3>
{#if Object.keys(orders).length === 0}
	<p>No orders.</p>
{:else}
	<ol>
		{#each Object.keys(orders) as orderKey, orderIndex}
			<li id="order-index-{orderIndex}">
				<dl>
					<dt>{orderKey}: ({orders[orderKey].length})</dt>
					<dd>
						<ul>
							{#each orders[orderKey] as item, itemIndex}
								<li id="item-index-{itemIndex}">??</li>
							{/each}
						</ul>
					</dd>
				</dl>
			</li>
		{/each}
	</ol>
{/if}

<!--

	<h3>Orders: {orders.length}</h3>
	{#if orders.length === 0}
	<p>No orders.</p>
	{:else}
	<ol>
		{#each orders as order, orderIndex}
		<li id="order-index-{orderIndex}">
			<dl>
				<dt>{order.orderNumber}: ({order.items.length})</dt>
				<dd>
					<ul>
						{#each order.items as item, itemIndex}
						<li id="item-index-{itemIndex}">
							{@debug item}
							{item.name} x{item.quantity} = {item.price * item.quantity}
							{#if item.comment}
							<p>{item.comment}</p>
							{/if}
						</li>
						{/each}
					</ul>
				</dd>
			</dl>
		</li>
		{/each}
	</ol>
	{/if}
	
-->
<style lang="postcss">
	h2 {
		@apply mb-4 text-xl;
	}

	h3 {
		@apply mb-2 text-lg;
	}

	ol {
		@apply list-decimal;
	}

	li {
		@apply mb-2;
	}

	dt {
		@apply font-bold;
	}

	dd {
		@apply ml-4;
	}
</style>
