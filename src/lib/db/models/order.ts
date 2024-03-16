import { dbClient } from './../client';
import type { Order, OrderItem, OrderStatus } from '@prisma/client';

class Orders {
	private static instance: Orders;
	private orderStatuses: OrderStatus[] = [];

	private constructor() {}

	public static getInstance(): Orders {
		if (!Orders.instance) {
			Orders.instance = new Orders();
		}
		return Orders.instance;
	}

	public async create(
		items: { foodId: number; quantity: number; cost: number }[],
		state = 'placed'
	): Promise<Order> {
		const status = await dbClient.orderStatus.findFirst({
			where: { state }
		});

		const order = await dbClient.order.create({
			data: {
				OrderItems: {
					create: items.map((item) => {
						return {
							quantity: item.quantity,
							food: { connect: { id: item.foodId } },
							cost: item.cost
						};
					})
				},
				statusId: status?.id,

				cost: items.reduce((acc, item) => acc + item.cost * item.quantity, 0)
			}
		});
		return order;
	}

	public async getById(id: number): Promise<Order> {
		const order = await dbClient.order.findUnique({
			where: { id }
			/*
			include: {
				status: true,
				OrderItems: true
			}*/
		});

		if (!order) {
			throw new Error(`Order, [${id}], does not exist`);
		}

		return order;
	}

	public async getByStatus(id?: number, state?: string): Promise<Order[]> {
		if (!id && !state) {
			throw new Error('Either id or state must be provided');
		}

		if (id) {
			const orders = await dbClient.order.findMany({
				where: { statusId: id }
			});

			return orders;
		}

		const orders = await dbClient.order.findMany({
			where: { status: { state } }
		});

		return orders;
	}

	public async getOrderItems(id: number): Promise<OrderItem[]> {
		const items = await dbClient.orderItem.findMany({
			where: {
				orderId: id
			}
		});

		return items;
	}

	public async getOrderStatus(id: number): Promise<OrderStatus> {
		const status = await dbClient.orderStatus.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Order status, [${id}], does not exist`);
		}

		return status;
	}

	public async getAll(): Promise<Order[]> {
		const orders = await dbClient.order.findMany({
			/*
			include: {
				status: true,
				items: true
			}
			*/
		});

		return orders;
	}
}

export const orderManagement = Orders.getInstance();
