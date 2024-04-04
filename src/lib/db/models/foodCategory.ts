import { dbClient } from './../client';
import type { FoodCategory } from '@prisma/client';

class foodCategory {
	private static instance: foodCategory;

	private constructor() {}

	public static getInstance(): foodCategory {
		if (!foodCategory.instance) {
			foodCategory.instance = new foodCategory();
		}
		return foodCategory.instance;
	}

	public async getById(id: number): Promise<FoodCategory> {
		const category = await dbClient.foodCategory.findUnique({
			where: { id }
		});

		if (!category) {
			throw new Error(`Category with: [${id}] not found`);
		}

		return category;
	}

	public async getByState(category: string): Promise<FoodCategory> {
		const status = await dbClient.foodCategory.findFirst({
			where: { name: category }
		});

		if (!status) {
			throw new Error(`Category with status [${category}] not found`);
		}

		return status;
	}

	public async getAll(): Promise<FoodCategory[]> {
		const statuses = await dbClient.foodCategory.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return statuses;
	}

	public async create(
		category: Omit<FoodCategory, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<FoodCategory> {
		return await dbClient.foodCategory.create({
			data: {
				name: category.name,
				description: category.description ? category.description : ''
			}
		});
	}

	public async update(
		id: number,
		category: Omit<FoodCategory, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<FoodCategory> {
		return await dbClient.foodCategory.update({
			where: { id },
			data: {
				name: category.name,
				description: category.description ? category.description : ''
			}
		});
	}
}

export const foodCategoryModel = foodCategory.getInstance();
