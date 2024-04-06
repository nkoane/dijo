import { dbClient } from './../client';
import type { Order, OrderItem, OrderStatus } from '@prisma/client';

class Orders {
	private static instance: Orders;

	private constructor() {}

	public static getInstance(): Orders {
		if (!Orders.instance) {
			Orders.instance = new Orders();
		}
		return Orders.instance;
	}

	public async create(
		orderItems: { foodId: number; quantity: number; cost: number }[],
		cost: number,
		state: string
	): Promise<Order> {
		const order = await dbClient.order.create({
			data: {
				OrderItems: {
					create: orderItems
				},
				status: {
					connect: {
						state: state
					}
				},
				cost: cost
			}
		});
		return order;
	}

	public async updateStatus(id: number, statusId: number): Promise<Order> {
		return await dbClient.order.update({
			where: { id },
			data: {
				statusId
			}
		});
	}

	/**
	 * Get order by id
	 *
	 * @param {number} id
	 * @return {*}  {Promise<Order>}
	 * @memberof Orders
	 */
	public async getById(id: number): Promise<Order> {
		const order = await dbClient.order.findUnique({
			where: { id }
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
		const orders = await dbClient.order.findMany({});

		return orders;
	}
}

export const orderModel = Orders.getInstance();
