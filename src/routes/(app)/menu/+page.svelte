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

	// add listen event to form submit

	$: console.log('(menu/page.svelte) -> menu', menu);
</script>

<h2 class="mb-12">Menu</h2>
<div class="flex gap-4">
	<section id="menu" class="flex-grow">
		{#each Object.keys(menu) as category}
			<dl class="bg-gray-50 p-4">
				<dt class="mb-2 border-b border-t font-bold">{category}</dt>
				<dd class="flex flex-wrap">
					{#each menu[category] as food}
						<ul class="mb-4 flex w-1/2 flex-grow justify-between gap-12 last:mb-0">
							<li class="w-3/4 bg-blue-50">
								<p>{food.name}</p>
								<p>{food.description}</p>
								<p>R{food.price}</p>
							</li>
							<li class="flex w-1/4 justify-between justify-self-center bg-pink-100">
								<button type="submit" formaction="?/add"><SquareMinus /></button>
								<button type="submit" formaction="?/add"><SquarePlus /></button>
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
			<ul class="list-decimal">
				{#each [1, 22, 44, 55] as foodId (foodId)}
					<input type="hidden" name="foodId-{foodId}" />
					<li class="border-b-2 border-white text-sm last:border-none">
						<dl class="flex justify-between">
							<dt>Food</dt>
							<dd>x {Math.max(1, Math.round(Math.random() * 4))}</dd>
							<dd>R {Math.round(Math.random() * 20) + 10}.00</dd>
							<button type="submit" formaction="?/trash"><Trash /></button>
						</dl>
					</li>
				{/each}
			</ul>
			<div class="flex justify-between">
				<p>total: R {100.45}</p>
				<p>paid: R {101.05}</p>
				<p>change: R {0.55}</p>
			</div>
			<button type="submit" formaction="?/checkout"><SquareArrowRight /> place</button>
		</form>
	</section>
</div>
