import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { kitchen } from '$lib/db/controllers/kitchen';
import { orderStatusManagement } from '$lib/db/models/orderStatus';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/kitchen');
	}

	if (locals.user.roleId > 4) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const states = ['paid', 'preparing', 'ready'];
	const orders = await kitchen.getOrders(states);
	const statuses = await orderStatusManagement.getAll();

	return {
		orders,
		statuses
	};
}) satisfies PageServerLoad;
