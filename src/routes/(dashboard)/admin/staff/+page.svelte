<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	export let data;
	const { staff, roles, states } = data;

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString();
	}

	function formatTime(date: Date) {
		return new Date(date).toLocaleTimeString();
	}

	const { form, errors } = superForm(data.form);
</script>

<h3>staff</h3>
<div class="flex justify-between gap-4 bg-red-50 p-4">
	<section class="flex-grow">
		{#if staff}
			{#each staff as person}
				<table class=" h-full w-full table-auto border-collapse border">
					<thead class="divide-y">
						<tr class="divide-x border">
							<th>Username</th>
							<th>Status</th>
							<th>Role</th>
							<th>Created</th>
							<th>Updated</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each staff as person}
							<tr class=" divide-x border">
								<td><a href="/admin/staff/{person.id}">{person.username}</a></td>
								<td>{person.status?.state}</td>
								<td>{person.role?.name}</td>
								<td>
									<div class="flex justify-between">
										<span>{formatDate(person.createdAt)}</span>
										<span>{formatTime(person.createdAt)}</span>
									</div>
								</td>
								<td class="">
									<div class="flex justify-between">
										<span>{formatDate(person.updatedAt)}</span>
										<span>{formatTime(person.updatedAt)}</span>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/each}
		{:else}
			<p>No staff, shem.</p>
		{/if}
	</section>
	<form action="/admin/staff" method="post">
		<p>
			<input type="text" name="username" placeholder="Username" bind:value={$form.username} />
			{#if $errors?.username}
				{#each $errors.username as message}
					<span class="my-2 block bg-red-200 text-xs">{message}</span>
				{/each}
			{/if}
		</p>
		<p>
			<input type="password" name="password" placeholder="Password" bind:value={$form.password} />
			{#if $errors?.password}
				{#each $errors.password as message}
					<span class="my-2 block bg-red-200 text-xs">{message}</span>
				{/each}
			{/if}
		</p>
		<p>
			<input
				type="password"
				name="confirm"
				placeholder="Confirm password"
				bind:value={$form.confirm} />
			{#if $errors?.confirm}
				{#each $errors.confirm as message}
					<span class="my-2 block bg-red-200 text-xs">{message}</span>
				{/each}
			{/if}
		</p>

		<p>
			<select name="roleId" id="role">
				{#each roles as role (role.id)}
					<option selected={role.id == parseInt($form.roleId)} value={role.id}>{role.name}</option>
				{/each}
			</select>
			{#if $errors?.roleId}
				<span class="my-2 block bg-red-200 text-xs">Uhmm, invalid role</span>
			{/if}
		</p>
		<p>
			<select name="stateId" id="status">
				{#each states as status (status.id)}
					<option selected={status.id == parseInt($form.stateId)} value={status.id}
						>{status.state}</option>
				{/each}
			</select>
			{#if $errors?.stateId}
				<span class="my-2 block bg-red-200 text-xs">Uhmm, invalid role</span>
			{/if}
		</p>
		<p><button type="submit">Add</button></p>
	</form>
</div>

<style lang="postcss">
	table tbody tr td {
		@apply px-2;
	}

	form {
		@apply flex w-1/4 flex-col gap-2;
	}

	form p input {
		@apply block w-full rounded border border-gray-300 p-2;
	}

	form p select {
		@apply block w-full rounded border border-gray-300 p-2;
	}

	form p button {
		@apply block w-full rounded bg-blue-500 p-2 text-white;
	}
</style>
