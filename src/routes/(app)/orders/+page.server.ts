import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { orderManagement } from '$lib/db/models/order';
import type { Order, OrderItem, OrderStatus, Food } from '@prisma/client';
import { foodManagement } from '$lib/db/models/food';

// type orderDetailed = Order & { orderStatus: OrderStatus | null; orderItems: OrderItem[] | null };
type orderDerailed = Order & {
	orderStatus: OrderStatus;
	orderItems: OrderItem & { food: Food }[];
};

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/orders');
	}

	if (locals.user.roleId > 3) {
		error(401, `Unauthorized: ${locals.user.roleId}`);
	}

	const orders = await orderManagement.getAll();

	if (orders && orders.length > 0) {
		const order: orderDerailed = {
			...orders[0],
			orderStatus: await orderManagement
				.getOrderStatus(orders[0].statusId)
				.then((status) => status),
			orderItems: (await Promise.all(
				await orderManagement.getOrderItems(orders[0].id).then((items) =>
					items.map(async (item) => {
						return {
							...item,
							food: await foodManagement.getById(item.foodId)
						};
					})
				)
			)) as OrderItem & { food: Food }[]
		};

		console.log('(app)/orders/+page.server.ts', order.orderItems);
	}
	return {
		orders
	};
}) satisfies PageServerLoad;
