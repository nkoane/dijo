<script lang="ts">
	export let data;
	export let form;
	import FoodForm from '$lib/components/app/food/FoodForm.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

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
	<FoodForm {data} {form} />
</section>
