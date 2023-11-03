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

export async function editFood(id: number, data: z.infer<typeof foodSchema>) {
    const food = await client.food.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            description: data.description ?? '',
            cost: data.cost,
            category: {
                connect: {
                    id: data.categoryId
                }
            }
        }
    });

    return food;
}
export async function createFood(data: z.infer<typeof foodSchema>) {
    const food = await client.food.create({
        data: {
            name: data.name,
            description: data.description ?? '',
            cost: data.cost,
            category: {
                connect: {
                    id: data.categoryId
                }
            }
        }
    });

    return food;
}

export async function getFood(id: number) {
    const food = await client.food.findUnique({
        where: {
            id: id
        },
        include: {
            category: true
        }
    });

    return food;
}

export async function getFoods(categoryId: number | null = null) {
    console.log('src/lib/index.ts', new Date().toLocaleTimeString(), categoryId);

    if (categoryId != null) {
        return await client.food.findMany({
            where: {
                categoryId: categoryId
            },
            include: {
                category: true
            }
        });
    }

    return await client.food.findMany({
        include: {
            category: true
        }
    });
}
