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

	public async getFoodPrice(foodId: number): Promise<number> {
		const foodCost = await dbClient.food.findFirst({
			where: { id: foodId }
		});

		if (foodCost?.price) {
			return foodCost?.price;
		}

		return 0;
	}

	public async create(
		items: { foodId: number; quantity: number; cost: number }[],
		state = 'placed'
	): Promise<Order | null> {
		const status = await dbClient.orderStatus.findFirst({
			where: { state }
		});

		const newOrder = await dbClient.order.create({
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

export const orderManagement = Orders.getInstance();
