<script lang="ts">
	export let data;
	$: console.log('(dashboard) admin/food +layout.svelte', data);
</script>

<section>
	<section class="mb-2 flex justify-between border-b pb-2">
		<h3>food</h3>
		<nav>
			<a href="/dashboard/admin/food/add">Create</a>
		</nav>
	</section>
	<slot />
</section>
