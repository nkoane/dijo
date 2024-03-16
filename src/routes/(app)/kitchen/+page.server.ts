import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { kitchen } from '$lib/db/controllers/kitchen';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/kitchen');
	}

	if (locals.user.roleId > 4) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const orders = await kitchen.getOrders();

	// console.log('(app)/kitchen/page-server::orders', orders);
	return {
		orders
	};
}) satisfies PageServerLoad;
