import { dbClient } from './../client';
import type { UserRole } from '@prisma/client';

class userRole {
	private static instance: userRole;

	private constructor() {}

	public static getInstance(): userRole {
		if (!userRole.instance) {
			userRole.instance = new userRole();
		}
		return userRole.instance;
	}

	public async getById(id: number): Promise<UserRole> {
		const status = await dbClient.userRole.findUnique({
			where: { id }
		});

		if (!status) {
			throw new Error(`Role id, [${id}], is not known`);
		}

		return status;
	}

	public async getByRole(name: string): Promise<UserRole> {
		const status = await dbClient.userRole.findFirst({
			where: { name }
		});

		if (!status) {
			throw new Error(`Role with name [${name}], not known`);
		}

		return status;
	}

	public async getAll(): Promise<UserRole[]> {
		const roles = await dbClient.userRole.findMany({
			orderBy: {
				id: 'asc'
			}
		});

		return roles;
	}
}

export const userRoleModel = userRole.getInstance();
