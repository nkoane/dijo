import type { OrderStatus } from '@prisma/client';
import type { FoodDetail, OrderDetail, OrderItemDetail, Orders } from './../index';

import { foodModel } from '../models/food';
import { foodCategoryModel } from '../models/foodCategory';
import { foodStatusModel } from '../models/foodStatus';
import { orderManagement } from '../models/order';
import { orderStatusManagement } from '../models/orderStatus';

class OrderRepository {
	private static instance: OrderRepository;
	private orderStates: OrderStatus[] = [];

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

	public async getOrder(id: number): Promise<OrderDetail | null> {
		try {
			const order = (await orderManagement.getById(id)) as OrderDetail;

			order.status = await orderStatusManagement.getById(order.statusId as number);
			order.items = (await orderManagement.getOrderItems(order.id)) as OrderItemDetail[];
			for (const item of order.items) {
				item.food = (await foodModel.getById(item.foodId)) as FoodDetail;
				if (item.food) {
					item.food.status = await foodStatusModel.getById(item.food.statusId as number);
					item.food.category = await foodCategoryModel.getById(item.food.categoryId);
				}
			}
			return order;
		} catch (error) {
			return null;
		}
	}

	public async getOrders(states?: string[]): Promise<Orders> {
		await this.getOrderStates();

		const orders: Orders = {};

		const statuses = states
			? this.orderStates.filter((status) => states.includes(status.state))
			: this.orderStates;

		for (const status of statuses) {
			const statusOrders = (await orderManagement.getByStatus(status.id)) as OrderDetail[];
			if (statusOrders.length != 0) {
				for (const order of statusOrders) {
					order.status = status;
					order.items = (await orderManagement.getOrderItems(order.id)) as OrderItemDetail[];
					for (const item of order.items) {
						item.food = (await foodModel.getById(item.foodId)) as FoodDetail;
						if (item.food) {
							item.food.status = await foodStatusModel.getById(item.food.statusId as number);
							item.food.category = await foodCategoryModel.getById(item.food.categoryId);
						}
					}
				}

				orders[status.state] = statusOrders;
			}
		}
		return orders;
	}

	public async updateOrder(
		orderId: number,
		state: string
	): Promise<{ data?: unknown; errors?: unknown }> {
		try {
			const order = await orderManagement.getById(orderId);
			const status = await orderStatusManagement.getByState(state);
			return {
				data: await orderManagement.updateStatus(order.id, status.id)
			};
		} catch (error) {
			return {
				errors: error instanceof Error ? error.message : error
			};
		}
	}

	public async createOrder(order: {
		orderItems: { foodId: number; quantity: number; cost: number }[];
		state?: string;
		cost: number;
	}): Promise<{ data?: unknown; errors?: unknown }> {
		if (!order.state) {
			order.state = 'placed';
		}

		try {
			return {
				data: await orderManagement.create(order.orderItems, order.cost, order.state)
			};
		} catch (error) {
			return {
				errors: error instanceof Error ? error.message : error
			};
		}
	}
}

export const orderRepository = OrderRepository.getInstance();
