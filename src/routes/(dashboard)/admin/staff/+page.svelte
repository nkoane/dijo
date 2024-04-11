<script lang="ts">
	import StaffForm from '$lib/components/app/people/StaffForm.svelte';

	export let data;
	const { staff, roles, states } = data;

	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString();
	}

	function formatTime(date: Date) {
		return new Date(date).toLocaleTimeString();
	}
</script>

<div class="flex justify-between gap-4 bg-red-50 p-4">
	<section class="flex-grow">
		{#if staff}
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
							<td>
								{#if data.user?.id == person.id}
									<a href="/profile" class="text-blue-500">You</a>
								{:else}
									<a href="/admin/staff/{person.id}">{person.username}</a>
								{/if}
							</td>
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
		{:else}
			<p>No staff, shem.</p>
		{/if}
	</section>
	<StaffForm {roles} {states} data={data.form} person={null} />
</div>
