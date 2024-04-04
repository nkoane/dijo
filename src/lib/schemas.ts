import { z } from 'zod';

export const categorySchema = z.object({
	name: z.string().trim().min(1),
	description: z.string().trim().optional()
});

export type CategorySchema = typeof categorySchema;
