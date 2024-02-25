<script lang="ts">
	export let form;
</script>

<h2 class="mb-4 text-2xl font-bold">Register</h2>
<section class="flex gap-4">
	<div class="flex-grow rounded-md p-4 text-gray-400">
		<p>Somthing, something ain't right.</p>
	</div>
	<form method="POST" class="min-w-96">
		<p>
			<input
				type="text"
				id="username"
				name="username"
				autocomplete="off"
				placeholder="Choose a username"
				value={form?.username ?? ''} />
			{#if form?.invalid.username}
				<span class="text-sm text-red-500"
					>{typeof form?.invalid.username == 'string'
						? form?.invalid.username
						: 'Invalid username'}</span>
			{/if}
		</p>

		<p>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="off"
				placeholder="Choose a password" />
			{#if form?.invalid.password}
				<span>Invalid password</span>
			{/if}
		</p>
		<p>
			<input
				type="password"
				id="verify_password"
				name="verify_password"
				autocomplete="off"
				placeholder="Verify your password" />
			{#if form?.invalid.verify_password}
				<span>Passwords don't match</span>
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
