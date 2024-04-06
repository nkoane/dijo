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
	// @todo we need to sanitise the response; remove the hashed_password

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

	public async doesUserExist(username: string): Promise<boolean> {
		const user = await dbClient.user.findFirst({
			where: { username }
		});
		return !!user;
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

	public async create({
		id,
		username,
		hashed_password,
		role,
		state
	}: {
		id: string;
		username: string;
		hashed_password: string;
		role: string;
		state?: string;
	}): Promise<User> {
		const user = await dbClient.user.create({
			data: {
				id: id,
				username: username,
				hashed_password: hashed_password,
				role: { connect: { name: role } },
				state: { connect: { state: state } }
			}
		});

		return this.getBy('id', user.id, false);
	}
}

export const userModel = Users.getInstance();
