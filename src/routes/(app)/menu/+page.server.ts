import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { menu } from '$lib/db/controllers/menu';
import type { FoodMenu } from '$lib/db';

let foodMenu: FoodMenu = {};

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/menu');
	}

	if (!locals.user.roleId) {
		redirect(303, '/');
	}

	foodMenu = await menu.getMenu();
	return {
		menu: foodMenu
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const order: {
			orderItems: { foodId: number; quantity: number; cost: number }[];
			cost: number;
			state: string;
		} = {
			orderItems: [],
			cost: 0,
			state: 'paid'
		};

		Array.from(formData.entries()).forEach(([key, value]) => {
			const foodId = parseInt(key.replace(/[^0-9]+/g, ''));
			const quantity = parseInt(value as string);

			if (isNaN(foodId) || isNaN(quantity)) {
				fail(400, { success: false, message: 'Invalid order item' });
			}
			if (quantity > 0) {
				const food = Object.values(foodMenu)
					.flat()
					.find((food) => food.id === foodId);
				if (food == undefined) {
					fail(400, { success: false, message: `Invalid food ${foodId} item` });
				} else {
					order.orderItems.push({ foodId: foodId, quantity: quantity, cost: food.price });
				}
			}
		});

		if (order.orderItems.length === 0) {
			fail(400, { success: false, message: 'No order items' });
		}

		order.cost = order.orderItems.reduce((acc, item) => acc + item.cost * item.quantity, 0);
		order.state = 'paid';

		console.log('(menu-page-server, order', order.orderItems, order.cost, order.state);
		console.clear();

		const result = await menu.placeOrder(order);

		console.log('(menu-page-server, results', result);

		return {
			order
		};
	}
} satisfies Actions;
