<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const account = data.user;
</script>

<h2>You</h2>

<div id="profile">
	<dl id="details">
			<dt>{account?.username}</dt>
			<dd>{account?.roleId}</dd>
			<dd>{account?.stateId}</dd>
	</dl>
	<form action="">
		<p>
			<label for="username">Change your the username?</label>
			<input type="text" id="username" />
			<span>
					 error
				</span>
				
		</p>
	</form>
</div>

<style lang="postcss">
	div#profile {
		dl.details {
			@apply bg-red-100 p-4;
		}

		form {
			@apply bg-yellow-4;
		}
	}

</style>
