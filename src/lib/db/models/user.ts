import { dbClient } from './../client';
import type { User } from '@prisma/client';

export enum Roles {
	ADMIN = 'admin',
	MANAGER = 'manager',
	CASHIER = 'cashier',
	KITCHEN = 'kitchen',
	WAITER = 'waiter',
	CUSTOMER = 'customer'
}

export type UserSafe = Omit<User, 'hashed_password'>;

class Users {
	private static instance: Users;

	private constructor() {}

	public static getInstance(): Users {
		if (!Users.instance) {
			Users.instance = new Users();
		}
		return Users.instance;
	}

	public async getBy(
		key: string,
		value: string | number | Date,
		withHashedPassword: boolean = false
	): Promise<User> {
		const person = await dbClient.user.findFirst({
			where: { [key]: value }
		});

		if (!person) {
			throw new Error(`A person with that ${key}: [${value}], does not exist`);
		}

		if (withHashedPassword !== true) {
			person.hashed_password = '';
		}

		return person;
	}

	public async getAll(query?: { key: string; value: string | number | Date }): Promise<UserSafe[]> {
		const people = await dbClient.user.findMany({
			where: query ? { [query.key]: query.value } : {},
			select: {
				id: true,
				username: true,
				roleId: true,
				stateId: true,
				createdAt: true,
				updatedAt: true
			}
		});
		return people;
	}

	public async getAllBy(): Promise<UserSafe[]> {
		const people = await dbClient.user.findMany({
			select: {
				id: true,
				username: true,
				roleId: true,
				stateId: true,
				createdAt: true,
				updatedAt: true
			}
		});
		return people;
	}

	/*


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
	}): Promise<UserSafe> {
		const person = await dbClient.user.create({
			data: {
				id: userId,
				username,
				hashed_password: hashed_password,
				role: { connect: { name: role } }
			}
		});

		if (!person) {
			throw new Error(`Failed to register/create a person with that username: [${username}]`);
		}

		return person;
	} */
}

export const userModel = Users.getInstance();
