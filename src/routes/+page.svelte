<script lang="ts">
	export let data;
</script>

<h2 class="mb-4 text-3xl font-bold">Hello, {data.user?.username ?? 'Stranger'}!</h2>
