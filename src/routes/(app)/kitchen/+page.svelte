<script lang="ts">
	import type { OrderDetail, Orders } from '$lib/db/index.js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import socket from '$lib/stores/socket.js';

	export let data;
	let orders: Orders = data?.orders || {};
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
					{ action: '?/prepare', label: 'Prepare' },
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
	let now = new Date();

	let durations: {
		orderId: number;
		createdAt: Date;
		updatedAt: Date;
		diff: number;
		words: string;
	}[] = [];

	function setTimeDifference(orderId: number, createdAt: Date, updatedAt: Date) {
		const diff: number = now.getTime() - new Date(createdAt).getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const words = `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;

		durations.push({
			orderId,
			createdAt,
			updatedAt,
			diff,
			words
		});

		return words;
	}

	Object.keys(orders).forEach((orderStatus) => {
		orders[orderStatus].forEach((order) =>
			setTimeDifference(order.id, order.createdAt, order.updatedAt)
		);
	});

	onMount(() => {
		// TODO: remove this
		$socket.on('testMessage', (message) => {
			console.log('testMessage', message);
		});

		const anchors = document.querySelectorAll('nav#kitchen-nav a');

		anchors.forEach((anchor, index) => {
			if (location.hash == (anchor as HTMLAnchorElement).hash) {
				anchors.forEach((a, i) => a.classList.remove('selected'));
				anchor.classList.add('selected');
			}

			anchor.addEventListener('click', (ev) => {
				const target = ev.target as HTMLAnchorElement;
				anchors.forEach((a, i) => a.classList.remove('selected'));
				target.classList.add('selected');
			});
		});

		$socket.on('kitchen-order-new', (data) => {
			if (data.order) {
				const order = data.order as OrderDetail;
				const msg = `new order (${order.id}-${order.status.state}) from (${$socket.id}) with ${order.items.length} items`;
				toast.success(msg);
				// orders = [...orders, order];
				if (orders[order.status.state] == undefined) {
					orders[order.status.state] = [];
				}
				orders[order.status.state] = [...orders[order.status.state], order];

				// TODO: focusAnchor(`#order-${order.status.state}`);
			}
		});

		let timeInterval = setInterval(() => {
			now = new Date();
		}, 1000);

		return () => {
			clearInterval(timeInterval);
		};
	});
</script>

<h2>Kitchen, {data.user?.username}: {data.user?.roleId}.</h2>

<h3 class="my-3">Orders: {theNumberOfOrders}</h3>
{#if Object.keys(orders).length === 0}
	<p>No orders.</p>
{:else}
	<nav id="kitchen-nav" class="flex w-full justify-between bg-gray-50">
		{#each Object.keys(orders) as orderStatus, orderIndex (orderStatus)}
			<a
				class="block bg-white px-2 py-1 font-bold text-gray-300 {orderIndex == 0
					? 'selected'
					: `select-none-${orderIndex}`}"
				href="#order-{orderStatus}">
				{orderStatus}: {orders[orderStatus].length}
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
								<td>
									<p>{String(order.id).padStart(4, '0')}</p>
									<!-- <p>{order.createdAt}</p> -->
									<p class="my-2 bg-gray-50">
										{durations.find((d) => d.orderId === order.id)?.words || '...'}
									</p>
									<!-- <p>{order.updatedAt}</p> -->
								</td>
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
											<input type="hidden" name="orderId" value={order.id} />
											{#each getFormOrderAction(order.status.state) as option, optionIndex}
												<button
													id="order-action-{order.id}-{optionIndex}"
													formaction="{option.action}#order-{orderStatus}"
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
