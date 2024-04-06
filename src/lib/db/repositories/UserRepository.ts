import type { User, UserRole, UserStatus } from '@prisma/client';
import { userModel, type UserSafe } from '../models/user';
import { userStatusModel } from '../models/userStatus';
import { userRoleModel } from '../models/userRole';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

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

	public async login({ username, password }: { username: string; password: string }): Promise<{
		data?: User | null;
		success: boolean;
		errors: string | null;
	}> {
		try {
			const user = await userModel.getBy('username', username, true);

			if ((await new Argon2id().verify(user.hashed_password, password)) === false) {
				throw new Error(); //'Invalid credentials');
			}

			if (user.stateId !== this.states.find((status) => status.state === 'active')?.id) {
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

	public async register({ username, password }: { username: string; password: string }): Promise<{
		data?: User | null;
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
				console.log(user);
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
