import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { kitchen } from '$lib/db/controllers/kitchen';
import { orderStatusModel } from '$lib/db/models/orderStatus';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/orders');
	}

	if (locals.user.roleId > 3) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const orders = await kitchen.getOrders();
	const statuses = await orderStatusModel.getAll();

	return {
		orders,
		statuses,
		totalOrders: Object.keys(orders).reduce((acc, key) => acc + orders[key].length, 0)
	};
}) satisfies PageServerLoad;
