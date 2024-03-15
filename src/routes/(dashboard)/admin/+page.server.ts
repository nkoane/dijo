import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		error(403, 'You are already logged in');
	}
	if (locals.user.roleId > 1) {
		error(401, 'Unauthorized');
	}
	return {};
}) satisfies PageServerLoad;
