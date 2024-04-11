<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import CategoryForm from '$lib/components/app/category/CategoryForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const category = data.category;
	const foods = data.foods;
</script>

<h3 class="mb-12">Categories</h3>
<div class="flex justify-between gap-4 bg-red-50 p-4">
	<section class="w-8/12 flex-grow">
		<table class=" h-full w-full table-auto border-collapse border">
			<thead class="divide-y">
				<tr class="divide-x border">
					<th>category</th>
					<th>description</th>
					<th>foods</th>
				</tr>
			</thead>
			<tbody class="divide-y">
				<tr class=" divide-x border">
					<td><a href="/admin/categories/{category.id}">{category.name}</a></td>
					<td>{category.description ?? ''}</td>
					<td>{foods?.length ?? '0'}</td>
				</tr>
			</tbody>
		</table>
	</section>
	<CategoryForm data={data.form} {category} />
</div>

<style lang="postcss">
	table tbody tr td {
		@apply pl-2;
	}
</style>
