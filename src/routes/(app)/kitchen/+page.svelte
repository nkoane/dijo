<script lang="ts">
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data;
	const { orders, statuses } = data;
	const theNumberOfOrders = Object.keys(orders).reduce((acc, key) => acc + orders[key].length, 0);

	// form actions

	const getFormOrderAction = (state: string): { action: string; label: string }[] => {
		switch (state) {
			case 'placed':
				return [
					{ action: '?/pay', label: 'Pay' },
					{ action: '?/cancel', label: 'Cancel' }
				];
			case 'paid':
				return [
					{ action: '?/preparing', label: 'Prepare' },
					{ action: '?/refund', label: 'Refund' }
				];
			case 'preparing':
				return [{ action: '?/ready', label: 'Ready' }];
			case 'ready':
				return [
					{ action: '?/collect', label: 'Collect' },
					{ action: '?/deliver', label: 'Deliver' }
				];
			case 'collected':
			case 'delivered':
				return [{ action: '?/complete', label: 'Complete' }];
			default:
				return [];
		}
	};

	onMount(() => {
		const socket = io({});

		// TODO: remove this
		socket.on('testMessage', (message) => {
			console.log('testMessage', message);
		});

		// TODO: socket notifications of a new order;
		socket.on('kitchen-order-new', (order) => {
			console.log('we got us an order', order);
			toast.success(`new order, it's like ${order.id} -> ${socket.id}`);
			// toast.success(`new: ${order.orderNumber} x ${order.OrderItems.length} items -> ${socket.id}`);
			// orders = [...orders, order];
		});

		const anchors = document.querySelectorAll('nav#kitchen-nav a');

		anchors.forEach((anchor, index) => {
			anchor.addEventListener('click', (ev) => {
				const target = ev.target as HTMLAnchorElement;
				anchors.forEach((a, i) => a.classList.remove('selected'));
				target.classList.add('selected');
			});
		});

		return () => {
			socket.disconnect();
		};
	});

	$: console.log('orders', orders, 'statuses', Object.keys(orders));
</script>

<h2>Kitchen, {data.user?.username}: {data.user?.roleId}.</h2>

<h3 class="my-3">Orders: {theNumberOfOrders}</h3>
{#if Object.keys(orders).length === 0}
	<p>No orders.</p>
{:else}
	<nav id="kitchen-nav" class="flex w-full justify-between bg-gray-50">
		{#each Object.keys(orders) as orderKey, orderIndex}
			<a
				class="block bg-white px-2 py-1 font-bold text-gray-300 {orderIndex == 0
					? 'selected'
					: `select-none-${orderIndex}`}"
				href="#order-{orderKey}">
				{orderKey}: {orders[orderKey].length}
			</a>
		{/each}
	</nav>
	<section class=" bg-yellow-50 p-2 py-1 text-sm">
		{#each Object.keys(orders) as orderStatus (orderStatus)}
			<div id="order-{orderStatus}" class="block text-sm">
				<table class="w-full">
					<thead>
						<tr>
							<th class="w-1/8">#-{orderStatus}</th>
							<th class="w-1/2">
								<table class="w-full">
									<thead>
										<tr>
											<th class="w-2/4">item</th>
											<th class="w-1/4">qty</th>
											<th class="w-1/4">cost</th>
											<th class="w-1/4">total</th>
										</tr>
									</thead>
								</table>
							</th>
							<th class="w-1/8">Cost</th>
							<th class="w-1/4">act</th>
						</tr>
					</thead>
					<tbody>
						{#each orders[orderStatus] as order (order.id)}
							<tr id="item-index-{order.id}">
								<td class="">{String(order.id).padStart(4, '0')}</td>
								<td class="">
									<table class="w-full">
										<tbody>
											{#each order.items as item (item.id)}
												<tr class="">
													<td class="w-2/4">{item.food.name}</td>
													<td class="w-1/8"
														>{@html item.quantity > 1 ? ` x ${item.quantity}` : '&nbsp;'}</td>
													<td class="w-1/8">{item.cost > 0 ? ` ${item.cost}` : ''}</td>
													<td class="w-1/4"
														>{item.cost > 0 ? `${item.cost * item.quantity}` : ''}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</td>
								<td>R{order.cost}</td>
								<td class="">
									{#if getFormOrderAction(order.status.state).length > 0}
										<form method="post" class="flex h-full justify-between">
											{#each getFormOrderAction(order.status.state) as option, optionIndex}
												<button
													id="order-action-{order.id}-{optionIndex}"
													formaction={option.action}
													class="h-full"
													type="submit"
													>{option.label}
												</button>
											{/each}
										</form>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3">Total</td>
							<td>
								<strong>R{orders[orderStatus].reduce((acc, order) => acc + order.cost, 0)}</strong>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		{/each}
	</section>
{/if}

<style lang="postcss">
	nav a.selected {
		color: #000;
		background-color: rgb(254, 253, 232);
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}

	table th,
	table td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	table th {
		text-align: left;
	}

	table tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	table tr td table tr:nth-child(even) {
		background-color: #fff;
	}

	table tr:last-child td:last-child {
	}
	table tr td table tr td {
		border-color: black;
	}

	button {
		@apply rounded-md bg-blue-500 px-2 py-2 text-xs font-bold uppercase text-white hover:bg-blue-700;
	}

	button:hover {
		@apply bg-blue-700;
	}

	section div {
		@apply hidden;
	}
	section div:first-child {
		@apply block;
	}

	section div:target {
		display: block;
	}

	section:has(div:target) div {
		display: none;
	}

	section:has(div:target) div:target {
		display: block;
	}
</style>
