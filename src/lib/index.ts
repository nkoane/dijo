import { PrismaClient, Prisma } from '@prisma/client';

export const client = new PrismaClient();

export async function getFoodCategories(): Promise<Prisma.Category[]> {
    const categories = client.category.findMany();

    return categories;
}
