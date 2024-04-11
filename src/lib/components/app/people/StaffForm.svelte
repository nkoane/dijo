<script lang="ts">
	import type { StaffSchema } from '$lib/schemas';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { UserRole, UserStatus } from '@prisma/client';
	import { superForm } from 'sveltekit-superforms';
	import type { UserDetail } from '$lib/db/repositories/UserRepository';

	export let roles: UserRole[];
	export let states: UserStatus[];

	export let data: SuperValidated<Infer<StaffSchema>>;
	export let person: UserDetail | null;

	const { form, errors } = superForm(data);
</script>

<form method="post">
	<p>
		<input type="text" name="username" placeholder="Username" bind:value={$form.username} />
		{#if $errors?.username}
			{#each $errors.username as message}
				<span class="my-2 block bg-red-200 text-xs">{message}</span>
			{/each}
		{/if}
	</p>
	<p>
		<input
			type="password"
			name="password"
			autocomplete="off"
			placeholder="Password"
			bind:value={$form.password} />
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
			autocomplete="off"
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
	<p><button type="submit">{!person ? 'Create' : 'Alter'}</button></p>
</form>

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
