<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	export let data;
	$: console.log('(dashboard) admin/food +page.svelte', data);
</script>

<h3>Foods</h3>

<section class="mb-2 flex justify-between border-b pb-2">
	<div class="bg-gray-100">
		{#if data?.foods?.length}}
		{:else}
			<p>No food found</p>
		{/if}
	</div>
	<form action="?/add" method="post" class="flex flex-col gap-4">
		<p>
			<input type="text" name="name" id="name" placeholder="name of food" />
			<textarea name="description" id="description" placeholder="description of food"></textarea>
		</p>
		<p>
			<select name="status" id="status">
				{#each data?.statuses as status}
					<option value={status}>{status.state}</option>
				{/each}
			</select>
			<select name="category" id="category">
				{#each data?.categories as category}
					<option value={category}>{category.name}</option>
				{/each}
			</select>
		</p>
		<p>
			<input type="number" name="price" id="price" placeholder="price of food" />
			<input type="file" name="image" id="image" placeholder="image of food" />
		</p>

		<Button type="submit">Create</Button>
	</form>
</section>

<style lang="postcss">
	form {
		@apply flex gap-4 rounded-md bg-yellow-50 p-4;
	}

	form p {
		@apply flex flex-col gap-4;
	}
	form input,
	form textarea {
		@apply w-full rounded-md border border-gray-300 p-2;
	}

	form select {
		@apply w-full rounded-md border border-gray-300 bg-white p-2;
	}
</style>
