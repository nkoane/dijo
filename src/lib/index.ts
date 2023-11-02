import { PrismaClient } from '@prisma/client';
import type { Category } from '@prisma/client';
import { z } from 'zod';

export const client = new PrismaClient();

export async function getFoodCategories(): Promise<Category[]> {
    const categories = client.category.findMany();

    return categories;
}

export const foodSchema = z
    .object({
        name: z.string().trim().min(1),
        description: z.string().trim().optional(),
        categoryId: z.coerce.number(), // (categoryIds),
        cost: z.coerce.number().positive()
    })
    .strict();
