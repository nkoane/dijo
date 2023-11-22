import { db } from '$lib';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const orders = await db.getOrders();
	return {
		orders: orders
	};
};

export const actions = {
	prepare: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (id === null || isNaN(id) == true) return { success: false, message: 'Invalid order id' };

		const status = await db.getOrderStatus({ state: 'preparing' });

		if (status === null) return { success: false, message: 'Invalid order status' };

		const result = await db.updateOrderStatus(id, status.id);

		return { success: true, order: result, status: status.state };
	},
	ready: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (id === null || isNaN(id) == true) return { success: false, message: 'Invalid order id' };

		const status = await db.getOrderStatus({ state: 'ready' });

		if (status === null) return { success: false, message: 'Invalid order status' };

		const result = await db.updateOrderStatus(id, status.id);

		return { success: true, order: result, status: status.state };
	},
	collected: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (id === null || isNaN(id) == true) return { success: false, message: 'Invalid order id' };

		const status = await db.getOrderStatus({ state: 'collected' });

		if (status === null) return { success: false, message: 'Invalid order status' };

		const result = await db.updateOrderStatus(id, status.id);

		return { success: true, order: result, status: status.state };
	},
	delivered: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (id === null || isNaN(id) == true) return { success: false, message: 'Invalid order id' };

		const status = await db.getOrderStatus({ state: 'delivered' });

		if (status === null) return { success: false, message: 'Invalid order status' };

		const result = await db.updateOrderStatus(id, status.id);

		return { success: true, order: result, status: status.state };
	},
	cancel: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (id === null || isNaN(id) == true) return { success: false, message: 'Invalid order id' };

		const status = await db.getOrderStatus({ state: 'cancelled' });

		if (status === null) return { success: false, message: 'Invalid order status' };

		const result = await db.updateOrderStatus(id, status.id);

		console.log('orders->page->server->cancel', `order: ${id} deleted`, result);

		return { success: true, order: result, status: status };
	}
} satisfies Actions;
