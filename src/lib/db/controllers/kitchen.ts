import type { Order, OrderStatus } from '@prisma/client';
import { orderManagement } from '../models/order';

class Kitchen {
	private static instance: Kitchen;
	private orderStatuses: OrderStatus[] = orderManagement.getOrderStatuses();
	private sortedOrders: { [key: string]: Order[] } = {};

	private constructor() {}

	public static getInstance(): Kitchen {
		if (!Kitchen.instance) {
			Kitchen.instance = new Kitchen();
		}
		return Kitchen.instance;
	}

	public async getOrders(): Promise<{ [key: string]: Order[] }> {
		for (const status of this.orderStatuses) {
			this.sortedOrders[status.state] = await orderManagement.getByStatus(status.id);
		}

		return this.sortedOrders;
	}
}

export const kitchen = Kitchen.getInstance();
