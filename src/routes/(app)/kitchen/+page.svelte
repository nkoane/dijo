<script lang="ts">
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data;

	let orders: {
		orderNumber: string;
		userId: string;
		items: {
			name: string;
			foodId: number;
			quantity: number;
			price: number;
			comment?: string;
		}[];
	}[] = [];

	onMount(() => {
		const socket = io();

		socket.on('testMessage', (message) => {
			console.log('testMessage', message);
		});

		socket.on('kitchen-order-new', (order) => {
			toast.success(`new: ${order.orderNumber} x ${order.OrderItems.length} items -> ${socket.id}`);
			orders = [...orders, order];
		});

		return () => {
			socket.disconnect();
		};
	});
</script>

<h2>Kitchen, {data.user?.username}: {data.user?.roleId}.</h2>
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
