import type { Food, FoodCategory, FoodStatus, Order, OrderItem, OrderStatus } from '@prisma/client';
import { orderManagement } from '../models/order';
import { foodManagement } from '../models/food';
import { foodStatusManagement } from '../models/foodStatus';
import { foodCategoryManagement } from '../models/foodCategory';

type FoodDetail = Food & { status: FoodStatus; category: FoodCategory };
type OrderItemDetail = OrderItem & { food: FoodDetail };
type OrderDetail = Order & { items: OrderItemDetail[]; status: OrderStatus };
type Orders = { [key: string]: OrderDetail[] };

class Kitchen {
	private static instance: Kitchen;
	private orderStatuses: OrderStatus[] = orderManagement.getOrderStatuses();
	private sortedOrders: { [key: string]: Order[] } = {};
	private detailedOrders: Orders = {};

	private constructor() {}

	public static getInstance(): Kitchen {
		if (!Kitchen.instance) {
			Kitchen.instance = new Kitchen();
		}
		return Kitchen.instance;
	}

	public async getOrders(): Promise<Orders> {
		for (const status of this.orderStatuses) {
			const statusOrders = (await orderManagement.getByStatus(status.id)) as OrderDetail[];
			for (const order of statusOrders) {
				order.items = (await orderManagement.getOrderItems(order.id)) as OrderItemDetail[];
				for (const item of order.items) {
					item.food = (await foodManagement.getById(item.foodId)) as FoodDetail;
					if (item.food) {
						item.food.status = await foodStatusManagement.getById(item.food.statusId as number);
						item.food.category = await foodCategoryManagement.getById(item.food.categoryId);
					}
				}
			}

			this.detailedOrders[status.state] = statusOrders;
		}
		return this.detailedOrders;
	}
}

export const kitchen = Kitchen.getInstance();
