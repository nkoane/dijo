import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { kitchen } from '$lib/db/controllers/kitchen';
import { orderStatusManagement } from '$lib/db/models/orderStatus';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/kitchen');
	}

	if (locals.user.roleId > 4) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const states = undefined; // ['paid', 'preparing', 'ready'];
	const orders = await kitchen.getOrders(states);
	const statuses = await orderStatusManagement.getAll();

	return {
		orders,
		statuses
	};
}) satisfies PageServerLoad;

export const actions = {
	cancel: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'cancelled');

		if (errors) {
			return fail(400, { errors, message: 'Houston, we have a problem!' });
		}

		return { success: true, order: data };
	},
	refund: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'refunded');

		if (errors) {
			return fail(400, { errors, message: 'I have a bad feeling about this.' });
		}

		return { success: true, order: data };
	},
	pay: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'paid');

		if (errors) {
			return fail(400, { errors, message: 'Keep the change, ya filthy animal!' });
		}

		return { success: true, order: data };
	},
	prepare: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'preparing');

		if (errors) {
			return fail(400, {
				errors,
				message: "I can't hold it, Captain! I'm giving her all she's got!"
			});
		}

		return { success: true, order: data };
	},
	ready: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'ready');

		if (errors) {
			return fail(400, { errors, message: 'I feel the need... the need for speed!' });
		}

		return { success: true, order: data };
	},
	collect: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'collected');

		if (errors) {
			return fail(400, { errors, message: "You can't handle the truth!" });
		}

		return { success: true, order: data };
	},
	deliver: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'delivered');

		if (errors) {
			return fail(400, { errors, message: 'I see dead people.' });
		}

		return { success: true, order: data };
	},
	complete: async ({ request }) => {
		const formData = await request.formData();

		const orderId = parseInt(formData.get('orderId') as unknown as string, 10);

		const { data, errors } = await kitchen.updateOrder(orderId, 'completed');

		if (errors) {
			return fail(400, { errors, message: 'Resistance is futile.' });
		}

		return { success: true, order: data };
	}
} satisfies Actions;
