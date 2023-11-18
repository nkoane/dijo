<script lang="ts">
	import type { OrderStatus } from '@prisma/client';
	import toast from 'svelte-french-toast';

	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	const socket = io();

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

		toast.success('Paid.');
	};

	const placeOrder = async () => {
		if (order.items.length === 0) return;
		order.status = status.find((status) => status.state === 'placed') ?? status[1];

		/*
            store order in db, send to kitchen, and clear order
        */

		order.items = [];
		order.status = status.find((status) => status.state === 'pending') ?? status[0];

		toast.success('Placed.');
	};
	export let form;

	if (form?.success === true) {
		socket.emit('order-placed', form?.order);
	}

	onMount(() => {
		// get user geo location
	});
</script>

<form method="post">
	<div class="mb-4 flex justify-between">
		<h2 class="text-2xl font-bold">ORDX</h2>
		{#if order.items.length > 0}
			<div class="order flex flex-row-reverse gap-2 items-center">
				{#if order.status.state == 'pending'}
					<p><button on:click={makePayment} class="order-button">PAY</button></p>
				{/if}
				{#if order.status.state == 'paid'}
					<p>
						<button type="submit" class="order-button">ORDER</button>
					</p>
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
			</div>
		{/if}
	</div>

	<section class="flex justify-between gap-2">
		<ol class="categories grid gap-2 grid-cols-2 w-full">
			{#each Object.keys(categories) as category (category)}
				<li class="category border-2 p-2">
					<ul class="category-foods bg-yellow-50 grid grid-cols-2 gap-2 h-36">
						{#each categories[category] as food (food)}
							<li class="food bg-yellow-100 place-items-center grid aspet active:bg-red-100">
								<button
									type="button"
									class="w-full h-full hover:bg-yellow-400"
									on:click={() => {
										addItem(food.id);
									}}>
									<dl class="food">
										<dt>{food.name}</dt>
										<dd class="font-bold">R{food.cost}</dd>
										<dd class="bg-black text-white inline-block px-2">
											{order.items.find((item) => item.id === food.id)?.quantity ?? 0}

											<input
												type="hidden"
												name="item[{food.id}]"
												value={order.items.find((item) => item.id === food.id)?.quantity ?? 0} />
										</dd>
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
</form>

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
