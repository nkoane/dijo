import { orderRepository } from '../repositories/OrderRepository';
import type { Orders } from '..';

class Kitchen {
	private static instance: Kitchen;
	private orders: Orders = {};

	private constructor() {}

	public static getInstance(): Kitchen {
		if (!Kitchen.instance) {
			Kitchen.instance = new Kitchen();
		}
		return Kitchen.instance;
	}

	public async getOrders(states?: string[]): Promise<Orders> {
		this.orders = await orderRepository.getOrders(states);

		return this.orders;
	}

	public async updateOrder(
		orderId: number,
		state: string
	): Promise<{ data?: unknown; errors?: unknown }> {
		return await orderRepository.updateOrder(orderId, state);
	}
}

export const kitchen = Kitchen.getInstance();
