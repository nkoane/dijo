<script lang="ts">
	import CategoryForm from '$lib/components/app/category/CategoryForm.svelte';
	export let data;

	const categories = data.categories;
	const category = null;
</script>

<h3 class="mb-12">Categories</h3>
<div class="flex justify-between gap-4 bg-red-50 p-4">
	<section class="flex-grow">
		{#if categories.length > 0}
			<table class=" h-full w-full table-auto border-collapse border">
				<thead class="divide-y">
					<tr class="divide-x border">
						<th>category</th>
						<th>description</th>
						<th>foods</th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each categories as category}
						<tr class=" divide-x border">
							<td><a href="/admin/categories/{category.id}">{category.name}</a></td>
							<td>{category.description ?? ''}</td>
							<td>{category.foods?.length ?? '0'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>No categories found</p>
		{/if}
	</section>
	<CategoryForm data={data.form} category={data?.category ?? null} />
</div>

<style lang="postcss">
	table tbody tr td {
		@apply pl-2;
	}
</style>
