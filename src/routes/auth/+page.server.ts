import { userRepository } from '$lib/db/repositories/UserRepository';
import { loginSchema, registerSchema } from '$lib/schemas';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

import { lucia } from '$lib/server/auth';
import type { User } from '@prisma/client';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// logout logic
	logout: async ({ cookies, locals }) => {
		if (!locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			...sessionCookie.attributes,
			path: '.'
		});

		redirect(302, '/?logout=true');
	},
	//  login logic
	login: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (form.valid === false) {
			return fail(400, { form });
		}

		const result = await userRepository.login(form.data);

		if (!result.success) {
			form.message = result.errors;
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
	},

	// register logic
	register: async ({ request }) => {
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

		if (!result.success) {
			form.message = result.errors;
			return fail(400, { form });
		}

		redirect(302, '/login?registered=true');
	}
};
