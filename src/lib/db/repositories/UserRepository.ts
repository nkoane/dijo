import type { User, UserRole, UserStatus } from '@prisma/client';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { type UserSafe, userModel } from '../models/user';
import { userRoleModel } from '../models/userRole';
import { userStatusModel } from '../models/userStatus';

export type UserDetail = UserSafe & { role?: UserRole; status?: UserStatus };

class UserRepository {
	private static instance: UserRepository;

	private roles: UserRole[] = [];
	private states: UserStatus[] = [];

	private constructor() {
		userStatusModel.getAll().then((states) => {
			this.states = states;
		});
		userRoleModel.getAll().then((roles) => {
			this.roles = roles;
		});
	}

	static getInstance() {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository();
		}
		return UserRepository.instance;
	}

	public async getAll(): Promise<UserDetail[]> {
		const users = (await userModel.getAll()) as unknown as UserDetail[];

		for (const user of users) {
			user.role = this.roles.find((role) => role.id === user.roleId);
			user.status = this.states.find((state) => state.id === user.stateId);
		}
		return users;
	}

	public async getAllRoles(except?: number): Promise<UserRole[]> {
		return this.roles.filter((role) => (except ? role.id !== except : true));
	}

	public async getAllStates(except?: number): Promise<UserStatus[]> {
		return this.states.filter((state) => (except ? state.id !== except : true));
	}

	public async get(id: string) {
		const person = (await userModel.getBy('id', id)) as unknown as UserDetail;
		if (person) {
			person.role = this.roles.find((role) => role.id === person.roleId);
			person.status = this.states.find((state) => state.id === person.stateId);
		}
		return person;
	}

	public async login({
		username,
		password
	}: {
		username: string;
		password: string;
	}): Promise<{
		data?: User | null;
		success: boolean;
		errors: string | null;
	}> {
		try {
			const user = (await userModel.getBy('username', username, true)) as User;

			if (
				(await new Argon2id().verify(user.hashed_password, password)) === false
			) {
				throw new Error(); //'Invalid credentials');
			}

			if (
				user.stateId !==
				this.states.find((status) => status.state === 'active')?.id
			) {
				return { success: false, errors: 'Account not activated' };
			}

			return { data: user, success: true, errors: null };
		} catch (error) {
			return {
				success: false,
				errors: 'Invalid credential' // error instanceof Error ? error.message : 'Failed to login'
			};
		}
	}

	public async modify(
		id: string,
		person: {
			username?: string;
			password?: string;
			roleId?: string;
			stateId?: string;
		}
	): Promise<{
		data?: UserSafe | null;
		success: boolean;
		errors: string | null;
	}> {
		const user = await userModel.getBy('id', id);
		if (!user) {
			return {
				data: null,
				success: false,
				errors: 'User not found'
			};
		}

		const data: {
			username?: string;
			hashed_password?: string;
			roleId?: number;
			stateId?: number;
		} = {};

		if (person.username) data.username = person.username;
		if (person.password)
			data.hashed_password = await new Argon2id().hash(person.password);
		if (person.roleId) data.roleId = parseInt(person.roleId);
		if (person.stateId) data.stateId = parseInt(person.stateId);

		if (Object.keys(data).length !== 0) {
			const result = await userModel.update(id, data);
			if (!result) {
				return {
					data: null,
					success: false,
					errors: 'Failed to modify'
				};
			}
			return {
				data: result,
				success: true,
				errors: null
			};
		}

		return {
			data: undefined,
			success: true,
			errors: null
		};
	}

	public async create(person: {
		username: string;
		password?: string;
		roleId: number;
		stateId: number;
	}): Promise<{
		data?: UserSafe | null;
		success: boolean;
		errors: string | null;
	}> {
		if ((await userModel.doesUserExist(person.username)) === false) {
			const hashed_password = await new Argon2id().hash(
				person.password ?? generateId(254)
			);
			try {
				const user = await userModel.create({
					id: generateId(15),
					username: person.username,
					hashed_password,
					roleId: person.roleId,
					stateId: person.stateId
				});

				if (!user) {
					throw new Error('Failed to create');
				}

				return {
					data: user,
					success: true,
					errors: null
				};
			} catch (error) {
				return {
					data: null,
					success: false,
					errors: 'Failed to register'
				};
			}
		} else {
			return {
				data: null,
				success: false,
				errors: 'User already exists'
			};
		}
	}

	public async register({
		username,
		password
	}: {
		username: string;
		password: string;
	}): Promise<{
		data?: UserSafe | null;
		success: boolean;
		errors: string | null;
	}> {
		if ((await userModel.doesUserExist(username)) === false) {
			const hashed_password = await new Argon2id().hash(password);
			const role = await userRoleModel.getByRole('customer');
			try {
				const user = await userModel.create({
					id: generateId(15),
					username,
					hashed_password,
					role: role.name
				});

				if (!user) {
					throw new Error('Failed to register');
				}

				return {
					data: user,
					success: true,
					errors: null
				};
			} catch (error) {
				return {
					data: null,
					success: false,
					errors: 'Failed to register'
				};
			}
		} else {
			return {
				data: null,
				success: false,
				errors: 'User already exists'
			};
		}
	}
}

export const userRepository = UserRepository.getInstance();
