import { dbClient } from './../client';
import type { Food, FoodCategory } from '@prisma/client';

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

	public async getById(id: number): Promise<Food | null> {
		const food = await dbClient.food.findUnique({
			where: { id }
			/*
			include: {
				category: true,
				status: true
			}
			*/
		});

		return food;
	}

	public async getAll(): Promise<Food[] | null> {
		const foods = await dbClient.food.findMany({
			/*
			include: {
				status: true,
				category: true
			}
			*/
		});

		return foods;
	}

	public async getAvailableFoods(): Promise<Food[] | null> {
		const foods = await dbClient.food.findMany({
			where: {
				statusId: 1 // TODO - change to enum
			}
			/*
			include: {
				status: true,
				category: true
			}
			*/
		});

		return foods;
	}

	public async getAllFoodCategory(): Promise<FoodCategory[]> {
		const categories = await dbClient.foodCategory.findMany({});
		return categories;
	}

	public async update(
		id: number,
		food: {
			name: string;
			description?: string;
			price: number;
			category: number;
			status: number;
			image?: string | null;
		}
	): Promise<Food> {
		const updatedFood = await dbClient.food.update({
			where: { id },
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
