import { error, fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import type { Actions, PageServerLoad } from './$types';

import { userRepository } from '$lib/db/repositories/UserRepository';
import { registerSchema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		error(403, 'You are already logged in');
	}

	const form = await superValidate(zod(registerSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(registerSchema));

		if (form.valid === false) {
			return fail(400, { form });
		}

		if (form.data.password !== form.data.confirmPassword) {
			form.message = 'Passwords do not match';
			form.valid = false;

			return fail(400, { form });
		}

		const result = await userRepository.register(form.data);

		console.log('auth.register', result);

		if (!result.success) {
			form.message = result.errors;
			return fail(400, { form });
		}

		redirect(302, '/login?registered=true');
	}
};
