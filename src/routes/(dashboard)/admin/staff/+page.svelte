<script lang="ts">
	export let data;
	const { people } = data;
</script>

<h3>staff</h3>
{#if people.length > 0}
	{#each data.people as person}
		<dl>
			<dt>{person.name}</dt>
			<dd>{person.status.state}</dd>
			<dd>{person.role?.name}</dd>
		</dl>
	{/each}
{:else}
	<p>No staff found</p>
{/if}
