<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Food } from '@prisma/client';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	export let data;
	const dijo = data?.dijo;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	type foodOrderItem = {
		food: {
			id: number;
			name: string;
			description: string;
			price: number;
		};
		quantity: number;
	};

	const order: { items: foodOrderItem[]; total: number } = {
		items: [],
		total: 0
	};

	const getOrderTotal = () => {
		return order.items.reduce((acc, item) => {
			return acc + item.food.price * item.quantity;
		}, 0);
	};

	function addItemToOrder(ev: SubmitEvent) {
		const form = ev.target as unknown as HTMLFormElement;
		const foodId = parseInt(form.foodId.value) as Number;
		let existingFoodItemIndex: number | null = null;

		existingFoodItemIndex = order.items.findIndex((item) => item.food.id === foodId);

		if (existingFoodItemIndex >= 0) {
			order.items[existingFoodItemIndex].quantity++;
		} else {
			const selectedFood = Object.values(dijo)
				.flat()
				.find((food) => food.id === foodId);

			if (selectedFood) {
				order.items = [...order.items, { food: selectedFood, quantity: 1 }];
			}
		}
		order.total = getOrderTotal();

		console.log('order', order, existingFoodItemIndex);

		/*
		socket.emit('menu-order-place', {
			orderNumber: form.orderId.value,
			userId: data.user?.id,
			items: [
				{
					name: 'Burger',
					foodId: 1,
					quantity: Math.floor(Math.random() * 5),
					price: 5.99,
					comment: 'No pickles'
				},
				{
					name: 'Fries',
					foodId: 2,
					quantity: Math.min(1, Math.floor(Math.random() * 5)),
					price: 2.99,
					comment: 'Extra salt'
				}
			]
		});

		form.orderId.value = crypto.randomUUID();
		*/
	}
</script>

<h2>Menu</h2>

{#if dijo}
	<main class="flex w-full gap-32 bg-yellow-50">
		<section id="menu" class="m-4 w-2/3 bg-fuchsia-500">
			{#each Object.keys(dijo) as category}
				<div class="food-group mb-4 w-full bg-red-500">
					<h3>{category}</h3>
					<ol class="food-items flex gap-2 bg-blue-500">
						{#each dijo[category] as food}
							<li class="w-1/2 bg-green-400 p-4 last:mb-0">
								<form on:submit={addItemToOrder}>
									<input type="hidden" id="foodId" value={food.id} />
									<h4>{food.name}</h4>
									<p>{food.description}</p>
									<p>R{food.price}</p>
									<p><Button type="submit">ADD</Button></p>
								</form>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</section>
		<section id="orders" class="w-1/3 bg-green-100 p-4">
			{#if order}
				<h3>Order</h3>
				<ol>
					{#each order.items as item}
						<li class="flex items-center justify-between">
							<span>{item.food.name}</span>
							<span>{item.food.price}</span>
							<span>x{item.quantity}</span>
							<span>{item.food.price * item.quantity}</span>
						</li>
					{/each}
				</ol>
				<dlc class="mt-4 flex justify-between bg-black p-2 text-white">
					<dt>total</dt>
					<dd>R{order.total}</dd>
				</dlc>
			{:else}
				<p>No order placed</p>
			{/if}
		</section>
	</main>
{/if}
