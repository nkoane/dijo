import { PrismaClient } from '@prisma/client';
import type { Category, Food } from '@prisma/client';
import { z } from 'zod';

export class DB {
    private client: PrismaClient;

    public foodSchema = z
        .object({
            name: z.string().trim().min(1),
            description: z.string().trim().optional(),
            categoryId: z.coerce.number(), // (categoryIds),
            cost: z.coerce.number().positive()
        })
        .strict();

    constructor() {
        this.client = new PrismaClient();
    }

    private getClient(): PrismaClient {
        return this.client;
    }

    public async getFoodCategories(): Promise<Category[]> {
        return this.getClient().category.findMany();
    }

    public async getFood(id: number): Promise<Food | null> {
        const food = await this.getClient().food.findUnique({
            where: {
                id: id
            }
        });
        return food;
    }

    public async getFoods(categoryId: number | null = null): Promise<Food[]> {
        const query = {
            where: {}
        };

        if (categoryId != null) query.where = { categoryId: categoryId };

        return await this.getClient().food.findMany(query);
    }

    public async editFood(id: number, data: z.infer<typeof this.foodSchema>) {
        const food = await this.getClient().food.update({
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
    public async createFood(data: z.infer<typeof this.foodSchema>) {
        const food = await this.getClient().food.create({
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
}
