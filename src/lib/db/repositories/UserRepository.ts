import type { User, UserRole, UserStatus } from '@prisma/client';
import { userModel, type UserSafe } from '../models/user';
import { userStatusModel } from '../models/userStatus';
import { userRoleModel } from '../models/userRole';
import { Argon2id } from 'oslo/password';

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

	public async login(username: string, password: string) {
		try {
			const user = await userModel.getBy('username', username, true);

			if ((await new Argon2id().verify(user.hashed_password, password)) === false) {
				throw new Error('Invalid credentials');
			}

			if (user.stateId !== this.states.find((status) => status.state === 'active')?.id) {
				throw new Error('Account not activated');
			}

			return { data: user, success: true, errors: null };
		} catch (error) {
			return {
				success: false,
				errors: 'Invalid credentials' // error instanceof Error ? error.message : error
			};
		}
	}

	/*
	public async login(username: string): Promise<UserSafe> {
		const person = await dbClient.user.findUnique({
			where: { username },
			select: {
				id: true,
				username: true,
				roleId: true,
				stateId: true,
				hashed_password: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (!person) {
			throw new Error(`A person with that username: [${username}], does not exist`);
		}

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
	} 
	*/
}

export const userRepository = UserRepository.getInstance();
