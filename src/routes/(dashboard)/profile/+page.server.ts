import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	userRepository,
	type UserDetail
} from '$lib/db/repositories/UserRepository';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/profile');
	}

	const account: UserDetail = await userRepository.get(locals.user.id);

	return {
		account
	};
}) satisfies PageServerLoad;
