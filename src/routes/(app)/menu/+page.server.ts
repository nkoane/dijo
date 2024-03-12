import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { foodManagement } from '$lib/db/food';
import type { Food } from '@prisma/client';
import type { Actions } from './$types';
import { orderManagement } from '$lib/db/order';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/menu');
	}

	// if the user role is bigger than 3, then deny access;
	if (!locals.user.roleId) {
		redirect(303, '/');
	}

	const dijo: Record<string, Food[]> = {};
	const foods = await foodManagement.getAvailableFoods();
	foods?.forEach((food) => {
		if (!dijo[food.category.name]) {
			dijo[food.category.name] = [];
		}
		dijo[food.category.name].push(food);
	});

	return {
		dijo
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const items: { foodId: number; quantity: number; cost: number }[] = [];

		for (const [key, value] of data.entries()) {
			const index = key as string;
			const foodId = parseInt(index.split('-')[1]);
			const quantity = parseInt(value as string);
			if (!isNaN(foodId) && !isNaN(quantity)) {
				items.push({
					foodId,
					quantity,
					cost: 0
				});
			}
		}

		if (items.length === 0) {
			return error(400, 'No items were selected');
		}
		// check if the food items are available

		const foods = await foodManagement.getAvailableFoods();
		if (!foods) {
			return fail(400, { message: 'Foods are not available' });
		}

		items.filter((item, index) => {
			foods.find((food) => {
				if (food.id === item.foodId) {
					items[index].cost = food.price * item.quantity;
					return true;
				}
				return false;
			});
		});

		if (items.length <= 0) {
			return fail(400, { message: 'Food iItems are not available' });
		}

		const order = await orderManagement.create(items);

		if (!order) {
			return fail(400, { message: 'Order could not be created' });
		}

		return {
			order
		};
	}
} satisfies Actions;
