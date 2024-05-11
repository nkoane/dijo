<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { account } = data;
</script>

<h2 class="scroll-mb-48">You</h2>

<div id="profile" class="flex gap-2">
	<dl id="details" class="flex-grow bg-red-100 p-4">
		<dt>{account?.username}</dt>
		<dd>{account.role?.name}</dd>
		<dd>{account.status?.state}</dd>
	</dl>
	<form method="post" class="min-w-64 bg-yellow-50 p-4">
		<p>
			<label for="username">change username?</label>
			<input type="text" id="username" autocomplete="username" />
			<span></span>
		</p>
		<fieldset class="">
			<p>
				<label for="password">new password?</label>
				<input type="password" id="password" autocomplete="new-password" />
				<span></span>
			</p>
			<p>
				<label for="confirm">Confirm password</label>
				<input type="password" id="confirm" autocomplete="new-password" />
				<span></span>
			</p>
		</fieldset>

		<p>
			<button type="submit">Update</button>
		</p>
	</form>
</div>

<style lang="postcss">
	form {
		@apply flex w-1/4 flex-col gap-2;
	}

	form p input {
		@apply block w-full rounded border border-gray-300 p-2;
	}

	form p span {
		@apply block bg-red-200 text-xs text-red-600;
	}

	form p button {
		@apply block w-full rounded bg-blue-500 p-2 text-white;
	}
</style>
