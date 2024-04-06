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

	const { form } = superForm(data.form);
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
		<p><input type="text" name="username" placeholder="Username" /></p>
		<p><input type="password" name="password" placeholder="Password" /></p>

		<p>
			<select name="roleId" id="role">
				{#each roles as role (role.id)}
					<option value={role.id}>{role.name}</option>
				{/each}
			</select>
		</p>
		<p>
			<select name="statusId" id="status">
				{#each states as status (status.id)}
					<option value={status.id}>{status.state}</option>
				{/each}
			</select>
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
