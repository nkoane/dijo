import { orderRepository } from '../repositories/OrderRepository';
import type { Order } from '@prisma/client';
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

	public async updateOrder(orderId: number, state: string): Promise<Order> {
		const result = await orderRepository.updateOrder(orderId, state);

		return result;
	}
}

export const kitchen = Kitchen.getInstance();
