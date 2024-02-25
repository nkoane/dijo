import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbClient } from '$lib/db/client';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/orders');
	}

	if (locals.user.roleId > 3) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const orders = await dbClient.order.findMany({});

	return {
		orders
	};
}) satisfies PageServerLoad;
