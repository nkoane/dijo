import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string().trim().min(1),
	description: z.string().trim().optional()
});

export type CategorySchema = typeof categorySchema;

export const loginSchema = z.object({
	username: z.string().trim().min(4),
	password: z.string().min(8)
});
