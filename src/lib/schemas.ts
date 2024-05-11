import type { UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';
import { userModel } from './db/models/user';

export const categorySchema = z.object({
	name: z.string().trim().min(1),
	description: z.string().trim().optional()
});

export type CategorySchema = typeof categorySchema;

export const loginSchema = z.object({
	username: z.string().trim().min(4),
	password: z.string().min(8)
});

export const registerSchema = z.object({
	username: z
		.string()
		.trim()
		.min(4, 'username must be at least 4 characters long')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'username can only contain letters, numbers, underscores, and hyphens'
		),
	password: z.string().min(8, 'password must be at least 8 characters long'),
	confirmPassword: z.string().min(8)
});

export const getStaffSchema = (roles: UserRole[], states: UserStatus[]) => {
	const staffSchema = z
		.object({
			id: z.string().readonly(),
			username: z
				.string()
				.trim()
				.min(4, 'username must be at least 4 characters long')
				.regex(
					/^[a-zA-Z0-9_-]+$/,
					'username can only contain letters, numbers, underscores, and hyphens'
				),
			password: z
				.string()
				.trim()
				.min(8, 'password must be at least 8 characters long')
				.optional(),
			confirm: z.string().trim().min(8).optional(),
			roleId: z.enum([
				roles[0].id.toString(),
				...roles.map((role) => role.id.toString()).slice(1, roles.length)
			] as const),
			stateId: z.enum([
				states[0].id.toString(),
				...states.map((state) => state.id.toString()).slice(1, states.length)
			] as const)
		})
		.refine(
			(data) => {
				if (data.password || data.confirm) {
					return data.password === data.confirm;
				}

				return true;
			},
			{
				message: "passwords don't match",
				path: ['confirm']
			}
		)
		.refine(
			async (data) => {
				if (!data.username) return true;

				const isTheUsernameAvailable = await userModel.isTheUsernameAvailable(
					data.username,
					data.id
				);

				return isTheUsernameAvailable;
			},
			{
				message: 'username already exists',
				path: ['username']
			}
		);

	return staffSchema;
};

export type StaffSchema = ReturnType<typeof getStaffSchema>;
