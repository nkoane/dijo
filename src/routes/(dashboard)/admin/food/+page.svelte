<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	export let data, form;

	$: {
	}
</script>

<section class="mb-2 flex justify-between gap-2 border-b pb-4">
	<div class="flex-grow rounded-md bg-gray-100 p-2">
		{#if data?.foods?.length}
			<table>
				<thead>
					<tr>
						<th>name</th>
						<th>price</th>
						<th>category</th>
						<th>status</th>
					</tr>
				</thead>
				<tbody>
					{#each data?.foods as food}
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
	<form method="post" class="flex flex-col gap-4">
		<p>
			<input
				type="text"
				name="name"
				id="name"
				placeholder="name of food"
				value={form?.food?.name ? form?.food.name.toString() : ''} />
			<textarea
				name="description"
				id="description"
				placeholder="description of food"
				value={form?.food?.description ? form?.food.description.toString() : ''}></textarea>
		</p>
		<p>
			<select name="statusId" id="status">
				{#each data?.statuses as status}
					<option
						value={status.id}
						selected={form?.food?.status ? form?.food.status == status.id : false}
						>{status.state}</option>
				{/each}
			</select>
			<select name="categoryId" id="category">
				{#each data?.categories as category}
					<option
						value={category.id}
						selected={form?.food?.category ? form?.food.category == category.id : false}
						>{category.name}</option>
				{/each}
			</select>
		</p>
		<p>
			<input
				type="number"
				name="price"
				id="price"
				placeholder="price of food"
				value={form?.food?.price ? form?.food.price.toString() : 0} />
			<input type="file" name="image" id="image" placeholder="image of food" />
		</p>

		<Button type="submit">Create</Button>
	</form>
</section>

<style lang="postcss">
	form {
		@apply flex w-1/3 flex-shrink-0 gap-4 rounded-md bg-yellow-50 p-4;
	}

	form p {
		@apply flex flex-col gap-4;
	}
	form input,
	form textarea {
		@apply w-full rounded-md border border-gray-300 p-2;
	}

	form select {
		@apply w-full rounded-md border border-gray-300 bg-white p-2 capitalize;
	}

	form select option {
		@apply capitalize;
	}

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
