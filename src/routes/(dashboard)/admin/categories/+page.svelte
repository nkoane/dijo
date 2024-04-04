<script lang="ts">
	export let data;
	const categories = data.categories;
	$: {
		console.log(data);
	}
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
							<td><a href="/admin/category/{category.id}">{category.name}</a></td>
							<td>{category.description ?? ''}</td>
							<td>{category.foods?.length ?? ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>No categories found</p>
		{/if}
	</section>
	<form method="post">
		<p>
			<label for="name">name</label>
			<input type="text" id="name" name="name" />
		</p>
		<p>
			<label for="description">description</label>
			<textarea name="description" id="description"></textarea>
		</p>
	</form>
</div>

<style lang="postcss">
	table tbody tr td {
		@apply pl-2;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form p label {
		@apply ml-2 text-sm;
	}

	form p input,
	form p textarea {
		@apply w-full rounded-sm bg-white p-2;
	}
</style>
