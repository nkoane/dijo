import type { FoodMenu } from '../index';
import { foodRepository } from '../repositories/FoodRepository';

class Menu {
	private static instance: Menu;

	private constructor() {}

	public static getInstance(): Menu {
		if (!Menu.instance) {
			Menu.instance = new Menu();
		}
		return Menu.instance;
	}

	public async getFood(): Promise<FoodMenu> {
		const menu = await foodRepository.getMenu('available');
		return menu;
	}
}

export const menu = Menu.getInstance();
