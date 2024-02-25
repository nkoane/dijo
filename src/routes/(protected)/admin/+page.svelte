<script lang="ts">
	export let data;

	const user = data?.user;
</script>

{#if user}
	<p>Hello {user.username}!</p>
{/if}
