import type { FoodDetail, FoodMenu } from './../index';

import { foodModel } from '../models/food';
import { foodCategoryModel } from '../models/foodCategory';
import { foodStatusModel } from '../models/foodStatus';
import type { FoodCategory, FoodStatus } from '@prisma/client';

class FoodRepository {
	private static instance: FoodRepository;
	private foodStates: FoodStatus[] = [];
	private foodCategories: FoodCategory[] = [];
	private menu: FoodMenu = {};

	private constructor() {
		foodStatusModel.getAll().then((states) => {
			this.foodStates = states;
		});
		foodCategoryModel.getAll().then((categories) => {
			this.foodCategories = categories;
		});
	}

	public static getInstance(): FoodRepository {
		if (!FoodRepository.instance) {
			FoodRepository.instance = new FoodRepository();
		}

		return FoodRepository.instance;
	}

	public async getMenu(state?: string): Promise<FoodMenu> {
		for (const category of this.foodCategories) {
			const foods = (await foodModel.getBy({
				categoryId: category.id,
				state: state
			})) as FoodDetail[];

			if (foods.length > 0) {
				for (const food of foods) {
					food.status = this.foodStates.find(
						(s) => s.id === food.statusId
					) as FoodStatus;
					food.category = category;
				}
				this.menu[category.name] = foods;
			}
		}
		return this.menu;
	}
}

export const foodRepository = FoodRepository.getInstance();
