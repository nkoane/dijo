<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const user = data?.user;
</script>

{#if user}
	<p>Hello {user.username}!</p>
{/if}
