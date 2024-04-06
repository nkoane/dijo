import { dbClient } from './../client';
import type { OrderStatus } from '@prisma/client';

class orderStatus {
	private static instance: orderStatus;

	private constructor() {}

	public static getInstance(): orderStatus {
		if (!orderStatus.instance) {
			orderStatus.instance = new orderStatus();
		}
		return orderStatus.instance;
	}

	public async getById(id: number): Promise<OrderStatus> {
		const status = await dbClient.orderStatus.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Status [${id}] not found`);
		}

		return status;
	}

	public async getByState(state: string): Promise<OrderStatus> {
		const status = await dbClient.orderStatus.findFirst({
			where: { state }
		});

		if (!status) {
			throw new Error(`Status [${state}] not found`);
		}

		return status;
	}

	public async getAll(): Promise<OrderStatus[]> {
		const statuses = await dbClient.orderStatus.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return statuses;
	}
}

export const orderStatusModel = orderStatus.getInstance();
