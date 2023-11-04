import { PrismaClient } from '@prisma/client';
import type { Category } from '@prisma/client';
import { z } from 'zod';

let client: PrismaClient;

export function getClient(): PrismaClient {
    if (client == undefined) {
        client = new PrismaClient();
    }

    return client;
}

export async function getFoodCategories(): Promise<Category[]> {
    return getClient().category.findMany();
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
    const food = await getClient().food.update({
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
    const food = await getClient().food.create({
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
    const food = await getClient().food.findUnique({
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
    const query = {
        where: {},
        include: {
            category: true
        }
    };

    if (categoryId != null) query.where = { categoryId: categoryId };

    return await getClient().food.findMany(query);
}
