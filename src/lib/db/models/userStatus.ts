import { dbClient } from './../client';
import type { UserStatus } from '@prisma/client';

class userStatus {
	private static instance: userStatus;

	private constructor() {}

	public static getInstance(): userStatus {
		if (!userStatus.instance) {
			userStatus.instance = new userStatus();
		}
		return userStatus.instance;
	}

	public async getById(id: number): Promise<UserStatus> {
		const status = await dbClient.foodStatus.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Status id, ${id}, is not known`);
		}

		return status;
	}

	public async getByState(state: string): Promise<UserStatus> {
		const status = await dbClient.foodStatus.findFirst({
			where: { state }
		});

		if (!status) {
			throw new Error(`Status with state, ${state}, not known`);
		}

		return status;
	}

	public async getAll(): Promise<UserStatus[]> {
		const statuses = await dbClient.foodStatus.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return statuses;
	}
}

export const userStatusModel = userStatus.getInstance();
