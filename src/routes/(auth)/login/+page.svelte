<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	export let data;

	const { errors, message } = superForm(data.form);
</script>

<h2 class="mb-4 text-3xl font-bold">Login</h2>

<form method="POST">
	{#if $message}
		<p class="mb-3 flex-grow rounded font-bold text-red-600">
			Oh-oh! {$message}.
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

			{#if $errors.username}
				<span>{$errors.username}</span>
			{/if}
		</p>
		<p>
			<input
				type="password"
				name="password"
				id="password"
				placeholder="Your password?"
				autocomplete="current-password" />

			{#if $errors.password}
				<span>{$errors.password}</span>
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
