import { dbClient } from './client';

export enum Roles {
	ADMIN = 'admin',
	MANAGER = 'manager',
	CASHIER = 'cashier',
	KITCHEN = 'kitchen',
	WAITER = 'waiter',
	CUSTOMER = 'customer'
}

interface appUserModelInterface {
	id: string;
	roleId: number;
	hashed_password: string;
	role: {
		id: number;
		name: string;
	};
}

class User {
	private static instance: User;

	private constructor() {}

	public static getInstance(): User {
		if (!User.instance) {
			User.instance = new User();
		}
		return User.instance;
	}

	public async findByUsername({
		username
	}: {
		username: string;
	}): Promise<appUserModelInterface | null> {
		const person = await dbClient.user.findUnique({
			where: { username },
			select: {
				id: true,
				roleId: true,
				hashed_password: true,
				role: true
			}
			// include: { role: true }
		});

		return person;
	}

	public async register({
		userId,
		username,
		hashed_password,
		role
	}: {
		userId: string;
		username: string;
		hashed_password: string;
		role: Roles;
	}): Promise<appUserModelInterface | null> {
		const person = await dbClient.user.create({
			data: {
				id: userId,
				username,
				hashed_password: hashed_password,
				role: { connect: { name: role } }
			}
		});

		if (person) {
			return this.findByUsername({ username });
		}

		return null;
	}
}

export const userManagement = User.getInstance();
