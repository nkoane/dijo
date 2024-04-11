<script lang="ts">
	import PersonForm from '$lib/components/app/people/PersonForm.svelte';

	export let data;

	const { states, roles, staff } = data;
</script>

<h4 class="mb-8">
	<span>{staff.username}</span> &middot;
	<span>{staff.role?.name}</span> &middot;
	<span>{staff.status?.state}</span>
</h4>

<section class="flex gap-4">
	<div class="flex-grow pt-4">activity</div>
	<PersonForm {roles} {states} data={data.form} {staff} />
</section>
