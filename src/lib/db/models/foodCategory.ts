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
		const status = await dbClient.foodCategory.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Category with: [${id}] not found`);
		}

		return status;
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
}

export const foodCategoryModel = foodCategory.getInstance();
