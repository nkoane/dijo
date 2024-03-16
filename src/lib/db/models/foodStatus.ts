import { dbClient } from './../client';
import type { FoodStatus } from '@prisma/client';

class foodStatus {
	private static instance: foodStatus;

	private constructor() {}

	public static getInstance(): foodStatus {
		if (!foodStatus.instance) {
			foodStatus.instance = new foodStatus();
		}
		return foodStatus.instance;
	}

	public async getById(id: number): Promise<FoodStatus> {
		const status = await dbClient.foodStatus.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Status ${id} not found`);
		}

		return status;
	}

	public async getByState(state: string): Promise<FoodStatus> {
		const status = await dbClient.foodStatus.findFirst({
			where: { state }
		});

		if (!status) {
			throw new Error(`Status ${state} not found`);
		}

		return status;
	}

	public async getAll(): Promise<FoodStatus[]> {
		const statuses = await dbClient.foodStatus.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return statuses;
	}
}

export const foodStatusManagement = foodStatus.getInstance();
