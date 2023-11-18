<script lang="ts">
	import type { Order } from '@prisma/client';
	import { onDestroy } from 'svelte';

	export let data;

	let orders = data.orders ?? [];

	let sortedOrders: {
		[key: string]: Order[];
	} = {};

	const sortOrders = () => {
		sortedOrders = {};
		orders.forEach((order) => {
			const key = order.Status?.state ?? 'pending';
			if (sortedOrders[key] == undefined) {
				sortedOrders[key] = [];
			}

			sortedOrders[key].push(order);
		});
	};

	const orderDurations: { [key: number]: string }[] = [];
	const orderIntervals: number[] = [];

	onDestroy(() => {
		console.log('kitchen:page -> destroying this');
		orderIntervals.forEach((interval) => {
			clearInterval(interval);
		});
	});

	$: if (orders.length > 0) {
		orders = orders;
		orders.forEach((order, index) => {
			orderIntervals[index] = setInterval(
				() => {
					orderDurations[index] = duration(order.updatedAt);
				},
				1000 * Math.max(1, index)
			);
		});

		sortOrders();
	}

	const duration = (createdAt: Date): string => {
		const now = new Date();
		const created = new Date(createdAt);
		const diff = now.getTime() - created.getTime();

		// get hours
		const hours = Math.floor(diff / 1000 / 60 / 60);
		// get minutes
		const minutes = Math.floor(diff / 1000 / 60) % 60;
		// get seconds
		const seconds = Math.floor(diff / 1000) % 60;

		// pad with 0
		return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds
			.toString()
			.padStart(2, '0')}s`;
	};

	console.log('kitchen:page -> orders: ', orders.length);
</script>

<h2 class="text-2xl font-bold mb-4">The Kitchen: {orders.length}</h2>
{#each Object.keys(sortedOrders) as state, index}
	<dl class="bg-blue-50 mb-2 p-2">
		<dt class="bg-white p-2 text-black font-bold text-sm uppercase">
			{state} : {sortedOrders[state].length.toString().padStart(2, '0')}
		</dt>
		{#each sortedOrders[state] as order}
			<dd class="bg-gray-100 mb-2 flex gap-4 p-2 justify-between">
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
				<p class="w-1/12">{orderDurations[index] ?? order.updatedAt.toDateString()}</p>
				<p class="w-2/12 text-xs bg-white p-2 uppercase self-start">
					{order.Status?.state}
				</p>
				<form method="post" class="w-3/12 justify-between flex flex-row-reverse gap-2 text-xs">
					<input type="hidden" name="id" value={order.id} />
					{#if order.Status?.state == 'placed'}
						<button
							type="submit"
							formaction="?/cancel"
							class="bg-red-600 p-2 block self-start rounded text-white font-bold">
							CANCEL
						</button>
						<button
							type="submit"
							formaction="?/prepare"
							class="bg-blue-600 text-white font-bold p-2 block self-start rounded">PREPARE</button>
					{/if}

					{#if order.Status?.state == 'preparing'}
						<button
							type="submit"
							formaction="?/ready"
							class="bg-blue-600 p-2 block self-start rounded text-white font-bold">READY</button>
					{/if}
					{#if order.Status?.state == 'ready'}
						<button
							type="submit"
							formaction="?/collected"
							class="bg-blue-600 p-2 block self-start rounded text-white font-bold"
							>COLLECTED</button>
						<button
							type="submit"
							formaction="?/delivered"
							class="bg-blue-600 p-2 block self-start rounded text-white font-bold"
							>DELIVERED</button>
					{/if}
				</form>
			</dd>
		{/each}
	</dl>
{/each}
