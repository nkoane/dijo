<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { io } from 'socket.io-client';
	export let data;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	let order: {
		foodId: number;
		quatitiy: number;
	}[];

	function paddItemToOrder(ev: SubmitEvent) {
		const form = ev.target as unknown as HTMLFormElement;
		const foodId = form.foodId.value;
		if (order == undefined) {
			order = [];
		}
		const existingFoodItemIndex = order.findIndex((food) => {
			return food.foodId == foodId;
		});
		if (existingFoodItemIndex) {
			console.log(existingFoodItemIndex);
		} else {
			order.push({
				foodId: foodId,
				quatitiy: 1
			});
		}

		console.log(order);

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

	const dijo = data?.dijo;
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
								<form on:submit={paddItemToOrder}>
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
		<section id="orders" class="w-1/3 bg-green-100">And the placed orders are listed here.</section>
	</main>
{/if}
