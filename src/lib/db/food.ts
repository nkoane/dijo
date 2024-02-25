import { dbClient } from './client';
import type { Food, FoodStatus, FoodCategory } from '@prisma/client';

class Foods {
	private static instance: Foods;

	private constructor() {}

	public static getInstance(): Foods {
		if (!Foods.instance) {
			Foods.instance = new Foods();
		}
		return Foods.instance;
	}

	public async create(food: {
		name: string;
		description?: string;
		price: number;
		category: number;
		status: number;
		image?: string | null;
	}): Promise<Food> {
		const newFood = await dbClient.food.create({
			data: {
				name: food.name,
				description: food.description ? food.description : '',
				price: food.price,
				category: {
					connect: {
						id: food.category
					}
				},
				status: {
					connect: {
						id: food.status
					}
				},
				image: food.image ? food.image : ''
			}
		});

		return newFood;
	}

	public async getAll(): Promise<[Food & { status: FoodStatus; category: FoodCategory }]> {
		const foods = await dbClient.food.findMany({
			include: {
				category: true,
				status: true
			}
		});

		return foods;
	}

	public async getAllFoodStatus(): Promise<FoodStatus[]> {
		const statuses = await dbClient.foodStatus.findMany({});
		return statuses;
	}

	public async getAllFoodCategory(): Promise<FoodCategory[]> {
		const categories = await dbClient.foodCategory.findMany({});
		return categories;
	}

	public async getById(
		id: number
	): Promise<(Food & { status: FoodStatus; category: FoodCategory }) | null> {
		const food = await dbClient.food.findUnique({
			where: { id },
			include: {
				category: true,
				status: true
			}
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
