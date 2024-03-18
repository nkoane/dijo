import type { FoodMenu } from '../index';
import { foodRepository } from '../repositories/FoodRepository';
import { orderRepository } from '../repositories/OrderRepository';

class Menu {
	private static instance: Menu;

	private constructor() {}

	public static getInstance(): Menu {
		if (!Menu.instance) {
			Menu.instance = new Menu();
		}
		return Menu.instance;
	}

	public async getMenu(): Promise<FoodMenu> {
		return await foodRepository.getMenu('available');
	}

	public async placeOrder(order: {
		orderItems: { foodId: number; quantity: number; cost: number }[];
		cost: number;
		state: string;
	}) {
		return await orderRepository.createOrder(order);
	}
}

export const menu = Menu.getInstance();
