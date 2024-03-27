<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	export let data: PageData;
	export let form: ActionData;

	const food = data?.food || {};
</script>

<form method="post" class="flex flex-col gap-4">
	<p class={form?.errors?.name ? 'error mb-0' : ''}>
		<input
			type="text"
			name="name"
			id="name"
			placeholder="name of food"
			value={form?.food?.name ? form?.food.name.toString() : food.name ?? ''} />
		{#if form?.errors?.name}
			<span>{form.errors.name}</span>
		{/if}
	</p>
	<p>
		<textarea
			name="description"
			id="description"
			placeholder="description of food"
			value={form?.food?.description ? form?.food.description.toString() : food.description ?? ''}
		></textarea>
	</p>
	<p>
		<select name="statusId" id="status">
			{#each data?.statuses as status}
				<option
					value={status.id}
					selected={form?.food?.statusId
						? form?.food.statusId == status.id
						: food.statusId == status.id}>{status.state}</option>
			{/each}
		</select>
		<select name="categoryId" id="category">
			{#each data?.categories as category}
				<option
					value={category.id}
					selected={form?.food?.categoryId
						? form?.food.categoryId == category.id
						: food.categoryId == category.id}>{category.name}</option>
			{/each}
		</select>
	</p>
	<p class={form?.errors?.price ? 'error mb-0' : ''}>
		<input
			type="number"
			name="price"
			id="price"
			placeholder="price of food"
			value={form?.food?.price ? form?.food.price.toString() : food.price ?? 0} />
		{#if form?.errors?.price}
			<span>{form.errors.price}</span>
		{/if}
	</p>
	<p>
		<input type="file" name="image" id="image" placeholder="image of food" />
	</p>

	<Button type="submit">{data?.food?.id ? 'Edit' : 'Create'}</Button>
</form>

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
	form p.error {
		@apply gap-1;
	}
	form p.error input,
	form p.error textarea {
		@apply mb-0 border-red-600;
	}

	form p.error span {
		@apply mx-2 text-xs text-red-600;
	}

	form select {
		@apply w-full rounded-md border border-gray-300 bg-white p-2 capitalize;
	}

	form select option {
		@apply capitalize;
	}
</style>
