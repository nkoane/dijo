import { orderRepository } from '../repositories/OrderRepository';
import type { Orders } from '..';

class Kitchen {
	private static instance: Kitchen;

	private constructor() {}

	public static getInstance(): Kitchen {
		if (!Kitchen.instance) {
			Kitchen.instance = new Kitchen();
		}
		return Kitchen.instance;
	}

	public async getOrders(states?: string[]): Promise<Orders> {
		return await orderRepository.getOrders(states);
	}

	public async updateOrder(
		orderId: number,
		state: string
	): Promise<{ data?: unknown; errors?: unknown }> {
		return await orderRepository.updateOrder(orderId, state);
	}
}

export const kitchen = Kitchen.getInstance();
