import { dbClient } from './client';
import type { Order, OrderStatus, OrderItem } from '@prisma/client';

class Orders {
	private static instance: Orders;

	private constructor() {}

	public static getInstance(): Orders {
		if (!Orders.instance) {
			Orders.instance = new Orders();
		}
		return Orders.instance;
	}

	public async create(order: { items: OrderItem[]; status: number }): Promise<Order> {
		const newOrder = await dbClient.order.create({
			data: {
				status: {
					connect: {
						id: order.status
					}
				},
				items: {
					create: order.items
				}
			}
		});

		return newOrder;
	}

	public async getById(
		id: number
	): Promise<(Order & { status: OrderStatus; items: OrderItem[] }) | null> {
		const order = await dbClient.order.findUnique({
			where: { id },
			include: {
				status: true,
				items: true
			}
		});

		return order;
	}

	public async getAll(): Promise<(Order & { status: OrderStatus; items: OrderItem[] })[] | null> {
		const orders = await dbClient.order.findMany({
			include: {
				status: true,
				items: true
			}
		});

		return orders;
	}
}

export const orders = Orders.getInstance();
