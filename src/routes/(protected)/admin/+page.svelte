<script lang="ts">
	export let data;

	const user = data?.user;
</script>

<h1>Admin</h1>

{#if user}
	<p>Welcome {user.username}!</p>
{/if}

{#if user?.roleId === 1}
	<div>Adminstration</div>
{/if}

{#if user?.roleId === 2}
	<div>Buy product.</div>
{/if}
