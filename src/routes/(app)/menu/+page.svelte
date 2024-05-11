<script lang="ts">
	import type { FoodDetail } from '$lib/db/index.js';

	import socket from '$lib/stores/socket.js';
	import {
		Beef,
		GlassWater,
		LeafyGreen,
		SquareArrowRight,
		SquareMinus,
		SquarePlus,
		Trash,
		Wheat
	} from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const { menu } = data;

	type Icon = {
		[category: string]:
			| typeof Wheat
			| typeof Beef
			| typeof LeafyGreen
			| typeof GlassWater;
	};

	const categoryIcons: Icon = {
		Starch: Wheat,
		Meat: Beef,
		Vegetables: LeafyGreen,
		Beverages: GlassWater
	};

	const order: {
		orderItems: {
			foodId: number;
			quantity: number;
			cost: number;
			food: FoodDetail;
		}[];
		cost: number;
		paid: number;
		isItPaid(): boolean;
		change: () => number;
	} = {
		orderItems: [],
		cost: 0,
		paid: 0,
		isItPaid: function (): boolean {
			return this.change() >= 0 && this.orderItems.length > 0;
		},
		change: function (): number {
			return this.paid - this.cost;
		}
	};

	const addOrRemoveFoodItem = (ev: SubmitEvent) => {
		if (ev.submitter === undefined) {
			alert('no submitter item selected');
			return;
		}

		const foodId = Number.parseInt(ev.submitter?.dataset.foodId as string, 10);
		const action = ev.submitter?.dataset.foodAction as string;

		const food = Object.values(menu)
			.flat()
			.find((food) => food.id === foodId);

		if (food === undefined) {
			alert('no food item found');
			return;
		}
		let orderItem = order.orderItems.find((item) => item.foodId === foodId);

		if (orderItem === undefined) {
			if (action === 'decrease' || action === 'trash') return;

			orderItem = {
				foodId: food.id,
				quantity: 0,
				cost: food.price,
				food
			};
			order.orderItems = [...order.orderItems, orderItem];
		}

		if (action === 'trash') {
			order.orderItems = order.orderItems.filter(
				(item) => item.foodId !== foodId
			);
		}

		if (action === 'increase' || action === 'decrease') {
			orderItem.quantity =
				action === 'increase' ? orderItem.quantity + 1 : orderItem.quantity - 1;
			orderItem.cost = orderItem.quantity * food.price;

			if (action === 'decrease' && orderItem.quantity === 0) {
				order.orderItems = order.orderItems.filter(
					(item) => item.foodId !== foodId
				);
			}
		}
		if (order.orderItems.length !== 0) {
			order.orderItems = order.orderItems
				.filter((item) => item !== undefined)
				.map(
					(item) =>
						item as {
							foodId: number;
							quantity: number;
							cost: number;
							food: FoodDetail;
						}
				);
		} else {
			order.paid = 0;
		}

		order.cost = order.orderItems.reduce((acc, item) => acc + item.cost, 0);
	};

	if (form?.order) {
		$socket.emit('menu-order-placed', { order: form.order });
	}
</script>

<h2 class="mb-6 ml-4">menu</h2>
<div class="flex gap-4">
	<section id="menu" class="flex-grow">
		<form method="post" on:submit|preventDefault={addOrRemoveFoodItem}>
			{#each Object.keys(menu) as category}
				<dl class="bg-gray-50 px-4">
					<dt class="mb-2 border-b border-t py-2 text-xl font-bold">
						{category}
					</dt>
					<dd class="flex gap-2">
						{#each menu[category] as food}
							<ul class="flex w-full justify-between">
								<li class="w-full bg-blue-50 px-4 py-2">
									<p class="font-bold">{food.name}</p>
									<p>{food.description}</p>
									<p>R{food.price}</p>
								</li>
								<li
									class=" flex flex-col justify-between bg-blue-100 px-2 py-2">
									<button
										type="submit"
										data-food-action="decrease"
										data-food-id={food.id}>
										<SquareMinus size="32" strokeWidth="1" />
									</button>
									<button
										type="submit"
										data-food-action="increase"
										data-food-id={food.id}>
										<SquarePlus size="32" strokeWidth="1" />
									</button>
								</li>
							</ul>
						{/each}
					</dd>
				</dl>
			{/each}
		</form>
	</section>
	<section id="order" class="w-3/12 flex-shrink-0 bg-pink-50">
		<!-- display order detaisl -->
		<h4 class="mb-2 border-b border-t px-4 py-2 text-xl font-bold">Order</h4>
		{#if order.orderItems.length > 0}
			<form method="post" on:submit|preventDefault={addOrRemoveFoodItem}>
				<ul class="p-4">
					{#each order.orderItems as orderItem}
						<input type="hidden" name="food-id-{orderItem.foodId}" />
						<li class="border-b border-black py-2 text-sm last:border-none">
							<dl class="flex justify-between gap-2 font-bold uppercase">
								<dt class="w-1/2 bg-green-100 pl-2">{orderItem.food.name}</dt>
								<dd class="w-1/4 bg-blue-100 pl-2">x {orderItem.quantity}</dd>
								<dd class="w-1/4 bg-red-100 pl-2">R {orderItem.cost}</dd>
								<button
									type="submit"
									data-food-action="trash"
									data-food-id={orderItem.foodId}
									class="ml-auto text-right"><Trash /></button>
							</dl>
						</li>
					{/each}
				</ul>
			</form>
		{/if}
		<div
			class="flex flex-col justify-between gap-2 border-b-4 border-t-4 border-white p-4 text-xs font-bold">
			<p class="flex justify-between gap-2">
				<span>total</span>
				<input
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					bind:value={order.cost}
					step="0.05"
					readonly
					class="w-2/3 px-1 py-1 text-right" />
			</p>
			<p class="flex justify-between gap-2">
				<span>paid</span>
				<input
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					bind:value={order.paid}
					step="0.05"
					class="w-2/3 px-1 py-1 text-right" />
			</p>
			<p class="flex justify-between gap-2">
				<span>change</span>
				<input
					type="text"
					inputmode="numeric"
					pattern="[\-0-9]*"
					value={order.change()}
					readonly
					step="0.05"
					class="w-2/3 px-1 py-1 text-right" />
			</p>
		</div>
		<form method="post">
			{#if order.orderItems.length > 0}
				{#each order.orderItems as item}
					<input
						type="hidden"
						name="item-food-{item.food.id}"
						value={item.quantity} />
				{/each}
			{/if}

			<div
				class="place flex justify-end border-b-4 border-white px-4 font-bold">
				<button
					type="submit"
					disabled={!order.isItPaid()}
					id="order-food"
					class="my-2 flex gap-2 uppercase disabled:cursor-not-allowed disabled:text-gray-400">
					<span>order</span>
					<SquareArrowRight />
				</button>
			</div>
		</form>
	</section>
</div>
