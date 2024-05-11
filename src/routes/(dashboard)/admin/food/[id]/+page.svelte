<script lang="ts">
	import FoodForm from '$lib/components/app/food/FoodForm.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const food = data?.food;
</script>

<h4>{food?.name}</h4>

<section class="mb-2 flex justify-between gap-2 border-b pb-4">
	<div class="flex-grow rounded-md bg-gray-100 p-2">
		{#if food}
			<ol class=" space-y-4">
				<li>
					R{food.price} | {food.category?.name} | {food.status?.state}
				</li>
				<li class=" prose bg-white p-2">
					{food.description}
				</li>
			</ol>
		{:else}
			<p>No food found</p>
		{/if}
	</div>
	<FoodForm categories={data.categories} states={data.states} {form} {food} />
</section>
