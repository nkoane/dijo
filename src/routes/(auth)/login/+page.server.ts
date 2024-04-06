import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { lucia } from '$lib/server/auth';
import { userRepository } from '$lib/db/repositories/UserRepository';
import type { User } from '@prisma/client';

export const load = (async ({ locals }) => {
	if (locals.user) {
		error(403, 'You are already logged in');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		const isPasswordInvalid = typeof password !== 'string' || !password;
		const isUsernameInvalid = typeof username !== 'string' || !username;

		if (isPasswordInvalid || isUsernameInvalid) {
			return fail(400, { invalid: { username: isUsernameInvalid, password: isPasswordInvalid } });
		}

		const result = await userRepository.login(username, password);

		if (!result.success) {
			return fail(400, { credentials: result.errors });
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
