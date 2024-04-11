import { z } from 'zod';
import { userRoleModel } from './db/models/userRole';
import type { UserRole, UserStatus } from '@prisma/client';

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
			username: z
				.string()
				.trim()
				.min(4, 'username must be at least 4 characters long')
				.regex(
					/^[a-zA-Z0-9_-]+$/,
					'username can only contain letters, numbers, underscores, and hyphens'
				),
			password: z.string().trim().min(8, 'password must be at least 8 characters long'),
			confirm: z.string().trim().min(8),
			roleId: z.enum([
				roles[0].id.toString(),
				...roles.map((role) => role.id.toString()).slice(1, roles.length)
			] as const),
			stateId: z.enum([
				states[0].id.toString(),
				...states.map((state) => state.id.toString()).slice(1, states.length)
			] as const)
		})
		.refine((data) => data.password === data.confirm, {
			message: "Passwords don't match",
			path: ['confirm']
		});
	return staffSchema;
};

export type StaffSchema = ReturnType<typeof getStaffSchema>;
