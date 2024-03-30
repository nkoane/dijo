<script lang="ts">
	export let data;
	const categories = data.categories;
	$: {
		console.log(data);
	}
</script>

<h3>Categories</h3>
<div class="flex justify-between">
	<section>
		{#if categories.length > 0}
			<ol>
				{#each categories as category}
					<li>{category.name}</li>
				{/each}
			</ol>
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
		@apply w-full rounded-sm bg-gray-100 p-2;
	}
</style>
