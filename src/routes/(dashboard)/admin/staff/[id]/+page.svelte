<script lang="ts">
	import StaffForm from '$lib/components/app/people/StaffForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { states, roles, person } = data;
</script>

<h4 class="mb-8">
	<span>{person.username}</span> &middot;
	<span>{person.role?.name}</span> &middot;
	<span>{person.status?.state}</span>
</h4>

<section class="flex gap-4">
	<div class="flex-grow pt-4">activity</div>
	<StaffForm {roles} {states} data={data.form} {person} />
</section>
