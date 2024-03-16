import type { Food, FoodCategory, FoodStatus, Order, OrderItem, OrderStatus } from '@prisma/client';
import { foodManagement } from '../models/food';
import { foodCategoryManagement } from '../models/foodCategory';
import { foodStatusManagement } from '../models/foodStatus';
import { orderManagement } from '../models/order';
import { orderStatusManagement } from '../models/orderStatus';

export type FoodDetail = Food & { status: FoodStatus; category: FoodCategory };
export type OrderItemDetail = OrderItem & { food: FoodDetail };
export type OrderDetail = Order & { items: OrderItemDetail[]; status: OrderStatus };
export type Orders = { [key: string]: OrderDetail[] };

class OrderRepository {
	private static instance: OrderRepository;
	private orderStates: OrderStatus[] = [];
	private detailedOrders: Orders = {};

	private constructor() {}

	public static getInstance(): OrderRepository {
		if (!OrderRepository.instance) {
			OrderRepository.instance = new OrderRepository();
		}

		return OrderRepository.instance;
	}

	public async getOrderStates(): Promise<OrderStatus[]> {
		if (this.orderStates.length == 0) {
			this.orderStates = await orderStatusManagement.getAll();
		}

		return this.orderStates;
	}

	public async getOrders(states?: string[]): Promise<Orders> {
		await this.getOrderStates();

		const statuses = states
			? this.orderStates.filter((status) => states.includes(status.state))
			: this.orderStates;

		for (const status of statuses) {
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

			if (statusOrders.length > 0) this.detailedOrders[status.state] = statusOrders;
		}
		return this.detailedOrders;
	}
}

export const orderRepository = OrderRepository.getInstance();
