import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/menu');
	}

	if (locals.user.roleId > 3) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}
	return {};
}) satisfies PageServerLoad;
