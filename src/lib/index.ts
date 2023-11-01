import { PrismaClient, Prisma } from '@prisma/client';

export const client = new PrismaClient();

export async function getFoodCategories() {
    const categories = client.category.findMany();

    return categories;
}
