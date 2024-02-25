<script lang="ts">
	export let data;

	$: console.log('(app) orders +page.svelte', data);
</script>

<h2>Orders</h2>

{#if data?.orders?.length}
	<p>We have orders</p>
{:else}
	<p>No orders</p>
{/if}
