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
	<form action="?/add" method="post">
		<input type="text" name="name" id="name" placeholder="name of food" />
		<textarea name="description" id="description" placeholder="description of food"></textarea>
		<input type="number" name="price" id="price" placeholder="price of food" />
		<Button type="submit">Create</Button>
	</form>
</section>
