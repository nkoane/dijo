import { dbClient } from './client';
import type { Food, FoodStatus, Category } from '@prisma/client';

class Foods {
	private static instance: Foods;

	private constructor() {}

	public static getInstance(): Foods {
		if (!Foods.instance) {
			Foods.instance = new Foods();
		}
		return Foods.instance;
	}

	public async create(food: Food): Promise<Food> {
		const newFood = await dbClient.food.create({
			data: {
				...food
			}
		});

		return newFood;
	}

	public async getAll(): Promise<Food[]> {
		const foods = await dbClient.food.findMany();

		return foods;
	}

	public async getFoodStatuses(): Promise<FoodStatus[]> {
		const statuses = await dbClient.foodStatus.findMany({});
		return statuses;
	}

	public async getById(id: number): Promise<Food | null> {
		const food = await dbClient.food.findUnique({
			where: { id }
		});

		return food;
	}

	public async update(id: number, food: Food): Promise<Food> {
		const updatedFood = await dbClient.food.update({
			where: { id },
			data: food
		});

		return updatedFood;
	}

	public async delete(id: number): Promise<Food> {
		const deletedFood = await dbClient.food.delete({
			where: { id }
		});

		return deletedFood;
	}
}

export const foodManagement = Foods.getInstance();
