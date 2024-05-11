<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2 class="mb-4 text-3xl font-bold">
	Hello, {data.user?.username ?? 'Stranger'}?
</h2>

<style lang="postcss">
	h2 {
		@apply mb-4 text-3xl font-bold;
	}
</style>
