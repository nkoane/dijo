<script lang="ts">
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let data;
	const { orders } = data;
	const theNumberOfOrders = Object.keys(orders).reduce((acc, key) => acc + orders[key].length, 0);
	let selectedBlock = '';

	onMount(() => {
		const socket = io();

		// TODO: remove this
		socket.on('testMessage', (message) => {
			console.log('testMessage', message);
		});

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
		{#each Object.keys(orders) as orderKey, orderIndex}
			<div id="order-{orderKey}" class="block text-sm">
				<table class="w-full">
					<thead>
						<tr>
							<th class="w-1/4">#-{orderIndex}</th>
							<th class="w-1/2">
								<table class="w-full">
									<thead>
										<tr>
											<th class="w-1/4">item</th>
											<th class="w-1/4">qty</th>
											<th class="w-1/4">cost</th>
											<th class="w-1/4">total</th>
										</tr>
									</thead>
								</table>
							</th>
							<th class="w-1/4">Cost</th>
							<th class="w-1/4">act</th>
						</tr>
					</thead>
					<tbody>
						{#each orders[orderKey] as order, orderIdex}
							<tr id="item-index-{orderIdex}">
								<td class="">{order.id}</td>
								<td class="">
									<table class="w-full">
										<tbody>
											{#each order.items as item, itemIndex}
												<tr class="">
													<td class="w-1/4">{item.food.name}</td>
													<td class="w-1/4">{item.quantity > 1 ? ` x ${item.quantity}` : ''}</td>
													<td class="w-1/4">{item.cost > 0 ? ` ${item.cost}` : ''}</td>
													<td class="w-1/4"
														>{item.cost > 0 ? `${item.cost * item.quantity}` : ''}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</td>
								<td>R{order.cost}</td>
								<td><button>ACTION</button></td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3">Total</td>
							<td>
								<strong>R{orders[orderKey].reduce((acc, order) => acc + order.cost, 0)}</strong>
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

	table tr:last-child td:last-child,
	table tr:last-child td:nth-last-child(2) {
	}

	button {
		@apply rounded-md bg-blue-500 px-2 py-2 text-xs font-bold text-white hover:bg-blue-700;
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
