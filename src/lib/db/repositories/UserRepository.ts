import type { User, UserRole, UserStatus } from '@prisma/client';
import type { UserSafe } from '../models/user';
import { userStatusModel } from '../models/userStatus';
import { userRoleModel } from '../models/userRole';

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
}

export const userRepository = UserRepository.getInstance();
