import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { userRepository } from '$lib/db/repositories/UserRepository';
import type { User } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms';
import { loginSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';

export const load = (async ({ locals }) => {
	if (locals.user) {
		error(403, 'You are already logged in');
	}

	const form = await superValidate(zod(loginSchema));

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(loginSchema));

		const result = await userRepository.login(form.data.username, form.data.password);

		if (!result.success) {
			form.message = 'Invalid credentials';
			return fail(400, { form });
		}

		const user = result.data as User;

		const session = await lucia.createSession(user.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, url.searchParams.get('r') || '/');
	}
};
