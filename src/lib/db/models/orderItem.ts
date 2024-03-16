import { dbClient } from './../client';
import type { OrderItem } from '@prisma/client';

class orderItem {
	private static instance: orderItem;

	private constructor() {}

	public static getInstance(): orderItem {
		if (!orderItem.instance) {
			orderItem.instance = new orderItem();
		}
		return orderItem.instance;
	}

	public async getById(id: number): Promise<OrderItem> {
		const status = await dbClient.orderItem.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Status ${id} not found`);
		}

		return status;
	}

	public async getAll(): Promise<OrderItem[]> {
		const statuses = await dbClient.orderItem.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		});

		return statuses;
	}

	public async getByOrderId(orderId: number): Promise<OrderItem[]> {
		const statuses = await dbClient.orderItem.findMany({
			where: { orderId }
		});

		return statuses;
	}
}

export const orderItemManagement = orderItem.getInstance();
