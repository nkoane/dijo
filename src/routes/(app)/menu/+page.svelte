<script lang="ts">
	import { io } from 'socket.io-client';
	import {
		Wheat,
		Beef,
		LeafyGreen,
		GlassWater,
		SquareArrowRight,
		SquarePlus,
		SquareMinus,
		Trash
	} from 'lucide-svelte';

	export let data;

	const dijo = data?.dijo;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	// map categories (starch, meat, vegetables, drinks) to the icons: Wheat, Beef, LeafyGreen, GlassWater respectively
	type Icon = {
		[category: string]: typeof Wheat | typeof Beef | typeof LeafyGreen | typeof GlassWater;
	};

	const categoryIcons: Icon = {
		Starch: Wheat,
		Meat: Beef,
		Vegetables: LeafyGreen,
		Drinks: GlassWater
	};

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

		// find the which button was clicked
		const action = (ev.submitter as HTMLButtonElement).dataset.action;

		existingFoodItemIndex = order.items.findIndex((item) => item.food.id === foodId);

		if (existingFoodItemIndex >= 0) {
			if (action === 'trash') {
				order.items.splice(existingFoodItemIndex, 1);
			} else if (action === 'minus') {
				order.items[existingFoodItemIndex].quantity--;
				if (order.items[existingFoodItemIndex].quantity <= 0) {
					order.items.splice(existingFoodItemIndex, 1);
				}
			} else if (action === 'plus') {
				order.items[existingFoodItemIndex].quantity++;
			}
		} else if (action === 'plus') {
			const selectedFood = Object.values(dijo)
				.flat()
				.find((food) => food.id === foodId);

			if (selectedFood) {
				order.items = [...order.items, { food: selectedFood, quantity: 1 }];
			}
		}
		order.total = getOrderTotal();
	}
</script>

<h2>Menu</h2>

{#if dijo}
	<main class="flex w-full gap-2 bg-yellow-50">
		<section id="menu" class="m-4 w-2/3 bg-fuchsia-500">
			{#each Object.keys(dijo) as category}
				<div class="food-group mb-4 w-full bg-red-500">
					<h3 class="flex items-center gap-2">
						<svelte:component this={categoryIcons[category]} />
						<span>{category}</span>
					</h3>

					<ol class="food-items bg-blue-500">
						{#each dijo[category] as food}
							<li class=" bg-green-400 p-4 last:mb-0">
								<form on:submit|preventDefault={addItemToOrder}>
									<input type="hidden" name="foodId" value={food.id} />
									<h4>{food.name}</h4>
									<p>{food.description}</p>
									<p class="flex justify-between">
										<!-- <button data-action="trash" type="submit"><Trash /></button> -->
										<span>R{food.price}</span>
										<button data-action="minus" type="submit"><SquareMinus /></button>
										<button data-action="plus" type="submit"><SquarePlus /></button>
									</p>
								</form>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</section>
		<section id="orders" class="w-1/2 bg-green-100 p-4">
			{#if order.items.length > 0}
				<h3>Order</h3>
				<table class="w-full border">
					<thead>
						<tr>
							<th>item</th>
							<th>price</th>
							<th>quantity</th>
							<th>cost</th>
							<th>act</th>
						</tr>
					</thead>
					<tbody>
						{#each order.items as item}
							<tr>
								<td>{item.food.name}</td>
								<td>{item.food.price}</td>
								<td>{item.quantity}</td>
								<td>{item.food.price * item.quantity}</td>
								<td>
									<form on:submit|preventDefault={addItemToOrder}>
										<input type="hidden" name="foodId" value={item.food.id} />
										<button data-action="trash" type="submit"><Trash /></button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
					{#if order.items.length === 0}
						<tr>
							<td colspan="4">No items in order</td>
						</tr>
					{:else}
						<tfoot>
							<tr>
								<td></td>
								<td></td>
								<td></td>
								<td>{order.total}</td>
								<td>
									<form method="POST">
										{#each order.items as item}
											<input type="hidden" name="food-{item.food.id}" value={item.quantity} />
										{/each}
										<button type="submit"><SquareArrowRight /></button>
									</form>
								</td>
							</tr>
						</tfoot>
					{/if}
				</table>
			{:else}
				<p>No order placed</p>
			{/if}
		</section>
	</main>
{/if}

<style>
	.food-items {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-auto-columns: 1fr 1fr;
		gap: 1rem;
	}

	table {
		border-collapse: collapse;
	}

	table tr th,
	table tr td {
		border: 1px solid #000;
		text-align: center;
	}
</style>
