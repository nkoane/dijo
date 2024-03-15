<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	export let form;
</script>

<h2 class="mb-4 text-3xl font-bold">Login</h2>

<form method="POST">
	{#if form?.credentials}
		<p class="mb-3 flex-grow rounded font-bold text-red-600">
			You have entered incorrect credentials.
		</p>
	{/if}
	<div class="justify-content flex items-start gap-4 bg-green-100 p-3">
		<p>
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Your username?"
				autocomplete="username" />
			{#if form?.invalid?.username}
				<span>Invalid username</span>
			{/if}
		</p>
		<p>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Your password?"
				autocomplete="current-password" />
			{#if form?.invalid?.password}
				<span>Invalid password</span>
			{/if}
		</p>
		<Button type="submit">GO</Button>
	</div>
</form>

<style lang="postcss">
	form p {
		@apply flex-grow;
	}
	form input {
		@apply block w-full flex-grow rounded-md border border-gray-300 p-2;
	}

	form span {
		@apply text-sm text-red-500;
	}
</style>
