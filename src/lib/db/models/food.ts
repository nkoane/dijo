import { dbClient } from './../client';
import type { Food } from '@prisma/client';

class Foods {
	private static instance: Foods;

	private constructor() {}

	public static getInstance(): Foods {
		if (!Foods.instance) {
			Foods.instance = new Foods();
		}
		return Foods.instance;
	}

	public async create(
		food: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Food> {
		return await dbClient.food.create({
			data: {
				name: food.name,
				description: food.description ? food.description : '',
				price: food.price,
				category: {
					connect: {
						id: food.categoryId
					}
				},
				status: {
					connect: {
						id: food.statusId
					}
				},
				image: food.image ? food.image : ''
			}
		});
	}

	public async getById(id: number): Promise<Food> {
		const food = await dbClient.food.findUnique({
			where: { id }
		});

		if (!food) {
			throw new Error(`food of id [${id}] not found`);
		}

		return food;
	}

	public async getAll(): Promise<Food[]> {
		const foods = await dbClient.food.findMany({});

		return foods;
	}

	public async getBy(options: {
		categoryId?: number;
		statusId?: number;
		state?: string;
	}) {
		const foods = await dbClient.food.findMany({
			where: {
				categoryId: options.categoryId,
				statusId: options.statusId,
				status: { state: options.state }
			}
		});

		return foods;
	}

	public async update(
		id: number,
		food: {
			name: string;
			description?: string;
			price: number;
			categoryId: number;
			statusId: number;
			image?: string;
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
						id: food.categoryId
					}
				},
				status: {
					connect: {
						id: food.statusId
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

export const foodModel = Foods.getInstance();
