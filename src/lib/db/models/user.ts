import type { User } from '@prisma/client';
import { dbClient } from './../client';

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
		withHashedPassword = false
	): Promise<User | UserSafe> {
		let person: User | UserSafe;
		if (withHashedPassword === true) {
			person = (await dbClient.user.findFirst({
				where: { [key]: value }
			})) as User;
		} else {
			person = (await dbClient.user.findFirst({
				where: { [key]: value },
				select: {
					id: true,
					username: true,
					roleId: true,
					stateId: true,
					createdAt: true,
					updatedAt: true
				}
			})) as UserSafe;
		}

		if (!person) {
			throw new Error(`a person with that ${key}: [${value}], does not exist`);
		}

		return person;
	}

	public async isTheUsernameAvailable(
		username: string,
		id?: string
	): Promise<boolean> {
		const user = await dbClient.user.findFirst({
			where: { username }
		});

		if (user) {
			if (id && user.id === id) {
				return true;
			}
			return false;
		}

		return true;
	}

	public async doesUserExist(username: string): Promise<boolean> {
		const user = await dbClient.user.findFirst({
			where: { username }
		});
		return !!user;
	}

	public async getAll(query?: {
		key: string;
		value: string | number | Date;
	}): Promise<UserSafe[]> {
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
		roleId,
		stateId
	}: {
		id: string;
		username: string;
		hashed_password: string;
		roleId: number;
		stateId: number;
	}): Promise<UserSafe> {
		const user = await dbClient.user.create({
			select: {
				id: true
			},
			data: {
				id: id,
				username: username,
				hashed_password: hashed_password,
				roleId: roleId,
				stateId: stateId
			}
		});

		return this.getBy('id', user.id, false);
	}

	public async update(
		id: string,
		data: {
			username?: string;
			hashed_password?: string;
			roleId?: number;
			stateId?: number;
		}
	): Promise<UserSafe> {
		const user = await dbClient.user.update({
			where: { id },
			data: data
		});

		return this.getBy('id', user.id, false);
	}
}

export const userModel = Users.getInstance();
