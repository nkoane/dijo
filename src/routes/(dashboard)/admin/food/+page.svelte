<script lang="ts">
	import FoodForm from '$lib/components/app/food/FoodForm.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData, form: ActionData; // ActionData

	let foods = data?.foods || [];
	const sortingBy: string = '';
	const sort = (ev: MouseEvent) => {
		const sortBy = (ev.target as HTMLAnchorElement).dataset.sort;
		switch (sortBy) {
			case 'name':
				foods = foods.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'price':
				foods = foods.sort((a, b) => a.price - b.price);
				break;
			case 'category':
				foods = foods.sort((a, b) => {
					if (a.category && b.category) {
						return a.category.name.localeCompare(b.category.name);
					}
					return 0;
				});
				break;
			case 'status':
				foods = foods.sort((a, b) => {
					if (a.status && b.status) {
						return a.status.state.localeCompare(b.status.state);
					}
					return 0;
				});
				break;
			default:
				foods = foods.sort((a, b) => a.id - b.id);
				break;
		}
	};
</script>

<section class="mb-2 flex justify-between gap-2 border-b pb-4">
	<div class="flex-grow rounded-md bg-gray-100 p-2">
		{#if foods.length > 0}
			<table>
				<thead>
					<tr>
						<th
							><a data-sort="name" href="#sort-by-name" on:click={sort}>name</a
							></th>
						<th>
							<a data-sort="price" href="#sort-by-price" on:click={sort}
								>price</a>
						</th>
						<th>
							<a data-sort="category" href="#sort-by-category" on:click={sort}
								>category</a>
						</th>
						<th>
							<a data-sort="status" href="#sort-by-status" on:click={sort}
								>status</a>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each foods as food}
						<tr>
							<td><a href="food/{food.id}">{food.name}</a></td>
							<td>R{food.price}</td>
							<td>{food.category?.name}</td>
							<td>{food.status?.state}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>No food found</p>
		{/if}
	</div>
	<FoodForm
		states={data.states}
		categories={data.categories}
		food={null}
		{form} />
</section>

<style lang="postcss">
	table {
		@apply w-full;
	}

	table th {
		@apply border-b border-gray-300 bg-blue-100 p-2 text-left;
	}

	table tr td {
		@apply border-b border-gray-300;
	}

	table tr:hover {
		@apply bg-yellow-100;
	}
</style>
