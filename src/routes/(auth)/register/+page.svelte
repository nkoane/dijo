<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, message } = superForm(data.form);
</script>

<h2 class="mb-4 text-2xl font-bold">Register</h2>
<section class="flex gap-4">
	<div class="flex-grow rounded-md p-4 text-gray-400">
		{#if $message}
			<p class="mb-3 flex-grow rounded font-bold text-red-600">
				Oh-oh! {$message}.
			</p>
		{/if}
	</div>
	<form method="POST" class="min-w-96">
		<p>
			<input
				type="text"
				id="username"
				name="username"
				autocomplete="off"
				placeholder="Choose a username"
				bind:value={$form.username} />
			{#if $errors.username}
				<span>{$errors.username}</span>
			{/if}
		</p>

		<p>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="off"
				placeholder="Choose a password"
				bind:value={$form.password} />
			{#if $errors.password}
				<span>{$errors.password}</span>
			{/if}
		</p>
		<p>
			<input
				type="password"
				id="confirmPassword"
				name="confirmPassword"
				autocomplete="off"
				placeholder="Confirm your password"
				bind:value={$form.confirmPassword} />
			{#if $errors.confirmPassword}
				<span>{$errors.confirmPassword}</span>
			{/if}
		</p>

		<p><button type="submit">Register</button></p>
	</form>
</section>

<style lang="postcss">
	form {
		@apply max-w-96;
	}
	form p {
		@apply mb-1 flex flex-col rounded-md bg-green-50 p-2;
	}

	form p:last-child {
		@apply mb-0 mt-2 bg-transparent p-0 pr-2;
	}

	form input {
		@apply rounded-md border border-gray-300 p-2;
	}

	form span {
		@apply mt-1 text-xs text-red-500;
	}

	form button {
		@apply self-end rounded-md bg-green-500 p-2 text-white;
	}

	form button:hover {
		@apply bg-green-600;
	}

	form button:disabled {
		@apply cursor-not-allowed bg-gray-200 text-gray-300;
	}
</style>
