import { PrismaClient } from '@prisma/client';
import type { Category, Food, FoodStatus } from '@prisma/client';
import { z } from 'zod';

export class DB {
    private client: PrismaClient;

    public foodSchema = z
        .object({
            name: z.string().trim().min(1),
            description: z.string().trim().optional(),
            categoryId: z.coerce.number(),
            statusId: z.coerce.number(),
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

    public async getFoodStatuses(): Promise<FoodStatus[]> {
        return this.getClient().foodStatus.findMany();
    }

    public async getFood(id: number): Promise<Food | null> {
        const food = await this.getClient().food.findUnique({
            where: {
                id: id
            }
        });
        return food;
    }

    public async getFoods(where: { [key: string]: number }): Promise<Food[]> {
        const query = {
            where: {}
        };
        query.where = where;

        return await this.getClient().food.findMany(query);
    }

    public async getFoodsWithCategory(where: {
        [key: string]: number;
        //}): Promise<(Food & { category: Category; status: FoodStatus })[]> {
    }): Promise<(Food & { category: Category })[]> {
        const query = {
            where: {},
            include: {
                category: true
            }
        };
        query.where = where;

        return await this.getClient().food.findMany(query);
    }

    public async editFood(id: number, data: z.infer<typeof this.foodSchema>) {
        console.log('lib/db/', data);
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
                },
                status: {
                    connect: {
                        id: data.statusId
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
                },
                status: {
                    connect: {
                        id: data.statusId
                    }
                }
            }
        });

        return food;
    }
}
