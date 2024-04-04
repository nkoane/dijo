<script lang="ts">
	/*
	import type { CategorySchema } from '$lib/schemas';

	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from '../../../../routes/$types';
	import type { FoodCategory } from '@prisma/client';

	export let data: SuperValidated<Infer<CategorySchema>>;

	$: console.log('-------> category-form: data', data);
	export let category: FoodCategory;

	const { form, errors } = superForm(data.form);

	//$: console.log('Category Form Svelte, super-form', form, errors, constraints, message);
	*/

	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { CategorySchema } from '$lib/schemas';
	import type { FoodCategory } from '@prisma/client';

	export let category: FoodCategory;
	export let data: SuperValidated<Infer<CategorySchema>>;
	const { form, errors, enhance, message } = superForm(data);
</script>

<div>
	{#if $message}
		<p class="bg-yellow-100 p-4 text-sm">{$message}</p>
	{/if}
	<form method="post">
		<p>
			<label for="name">name</label>
			<input type="text" id="name" name="name" bind:value={$form.name} />
			{#if $errors?.name}
				<span>{$errors.name}</span>
			{/if}
		</p>
		<p>
			<label for="description">description</label>
			<textarea name="description" id="description" bind:value={$form.description}></textarea>
		</p>
		<p><button>{category ? 'Edit' : 'Add'}</button></p>
	</form>
</div>

<style lang="postcss">
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form button {
		@apply w-full rounded-sm bg-blue-500 p-2 text-white;
	}

	form p label {
		@apply ml-2 text-sm;
	}

	form p input,
	form p textarea {
		@apply w-full rounded-sm bg-white p-2;
	}

	form p span {
		@apply block py-2 text-xs text-red-500;
	}
</style>
