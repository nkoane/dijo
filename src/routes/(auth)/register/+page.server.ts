import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { Roles } from '$lib/db/models/user';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { userManagement } from '$lib/db/models/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		error(403, 'You are already logged in');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const verify_password = data.get('verify_password');

		const isPasswordInvalid =
			typeof password !== 'string' || !password || password.length < 8 || password.length > 255;

		const isUsernameInvalid =
			typeof username !== 'string' ||
			!username ||
			username.length < 4 ||
			username.length > 20 ||
			!/^[a-zA-Z0-9_-]+$/.test(username);

		const arePasswordsInvalid = password !== verify_password;

		if (isPasswordInvalid || isUsernameInvalid || arePasswordsInvalid) {
			return fail(400, {
				invalid: {
					username: isUsernameInvalid,
					password: isPasswordInvalid,
					verify_password: arePasswordsInvalid
				},
				username
			});
		}

		const user = await userManagement.findByUsername({ username });

		if (user) {
			return fail(400, {
				invalid: {
					username: 'Username already taken',
					password: isPasswordInvalid,
					verify_password: arePasswordsInvalid
				},
				username
			});
		}

		const userId = generateId(15);
		const hashed_password = await new Argon2id().hash(password);

		const result = await userManagement.register({
			userId: userId,
			username: username,
			hashed_password: hashed_password,
			role: Roles.CUSTOMER
		});

		if (!result) {
			error(500, 'Failed to register');
		}

		redirect(302, '/login?registered=true');
	}
};
