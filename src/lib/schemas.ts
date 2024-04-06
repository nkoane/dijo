import { z } from 'zod';
import { userRoleModel } from './db/models/userRole';

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
		.min(4)
		.regex(/^[a-zA-Z0-9_-]+$/),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
});
