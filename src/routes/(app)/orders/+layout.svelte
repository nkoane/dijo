<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: console.log('(app) orders +layout.svelte', data);
</script>

<slot />
