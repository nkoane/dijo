<script lang="ts">
	import { io } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';

	import {
		Wheat,
		Beef,
		LeafyGreen,
		GlassWater,
		SquareArrowRight,
		SquarePlus,
		SquareMinus,
		Trash,
		Key
	} from 'lucide-svelte';

	export let data;
	export let form;

	const { menu } = data;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	type Icon = {
		[category: string]: typeof Wheat | typeof Beef | typeof LeafyGreen | typeof GlassWater;
	};

	const categoryIcons: Icon = {
		Starch: Wheat,
		Meat: Beef,
		Vegetables: LeafyGreen,
		Beverages: GlassWater
	};

	$: if (form?.order) {
		console.log('(app)/menu: form->order', form.order);
		socket.emit('menu-order-placed', form.order);
	}

	$: console.log(form);
</script>

<h2 class="mb-12">Menu</h2>
<div class="flex gap-4">
	<section id="menu" class="flex-grow">
		{#each Object.keys(menu) as category}
			<dl class="bg-gray-50 px-4">
				<dt class="mb-2 border-b border-t py-2 text-xl font-bold">{category}</dt>
				<dd class="flex gap-2">
					{#each menu[category] as food}
						<ul class="flex w-full justify-between">
							<li class="w-full bg-blue-50 px-4 py-2">
								<p class="font-bold">{food.name}</p>
								<p>{food.description}</p>
								<p>R{food.price}</p>
							</li>
							<li class=" flex flex-col justify-between bg-blue-100 px-2 py-2">
								<button type="button" data-food-action="decrease" data-food-id={food.id}
									><SquareMinus size="36" /></button>
								<button type="button" data-food-action="increase" data-food-id={food.id}
									><SquarePlus size="36" /></button>
							</li>
						</ul>
					{/each}
				</dd>
			</dl>
		{/each}
	</section>
	<section id="order" class="w-3/12 flex-shrink-0 bg-pink-50">
		<!-- display order detaisl -->
		<form method="post">
			<h4 class="mb-2 border-b border-t px-4 py-2 text-xl font-bold">Order</h4>
			<ul class="p-4">
				{#each [Math.max(1, Math.round(Math.random() * 10)), Math.max(10, Math.round(Math.random() * 20)), Math.max(20, Math.round(Math.random() * 40)), Math.max(40, Math.round(Math.random() * 80))] as foodId (foodId)}
					<input type="hidden" name="food-id-{foodId}" />
					<li class="border-b border-black py-2 text-sm last:border-none">
						<dl class="flex justify-between">
							<dt>Food</dt>
							<dd>x {Math.max(1, Math.round(Math.random() * 4))}</dd>
							<dd>R {Math.round(Math.random() * 20) + 10}.00</dd>
							<button type="button" data-action="trash"><Trash /></button>
						</dl>
					</li>
				{/each}
			</ul>
			<div
				class="flex flex-col justify-between gap-2 border-b border-t border-black p-4 text-xs font-bold">
				<p class="flex justify-between gap-2">
					<span>total</span>
					<input
						type="text"
						inputmode="numeric"
						pattern="[0-9]*"
						value={150}
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
						value={100}
						step="0.05"
						class="w-2/3 px-1 py-1 text-right" />
				</p>
				<p class="flex justify-between gap-2">
					<span>change</span>
					<input
						type="text"
						inputmode="numeric"
						pattern="[\-0-9]*"
						value={-50}
						readonly
						step="0.05"
						class="w-2/3 px-1 py-1 text-right" />
				</p>
			</div>
			<div class="place flex justify-end border-b border-black font-bold">
				<button type="submit" class="my-2 flex gap-2 uppercase">
					<span>order</span>
					<SquareArrowRight />
				</button>
			</div>
		</form>
	</section>
</div>
