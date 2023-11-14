import { PrismaClient } from '@prisma/client';
import type { Category, Food, FoodStatus, Order, OrderStatus } from '@prisma/client';
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

    public orderItemSchema = z.object({
        quantity: z.coerce.number().positive(),
        cost: z.coerce.number().positive(),
        foodId: z.coerce.number(),
        orderId: z.coerce.number()
    });

    public orderSchema = z.object({
        statusId: z.coerce.number(),
        items: z.array(this.orderItemSchema),
        cost: z.coerce.number().positive()
    });

    constructor() {
        this.client = new PrismaClient();
    }

    private getClient(): PrismaClient {
        return this.client;
    }

    public async getStatuses(): Promise<OrderStatus[]> {
        return this.getClient().orderStatus.findMany();
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

    public async createOrder(data: {
        statusId: OrderStatus['id'];
        orderItems: {
            foodId: number;
            quantity: number;
            cost: number;
        }[];
        cost: number;
    }): Promise<Order> {
        const order = await this.getClient().order.create({
            data: {
                Status: {
                    connect: {
                        id: data.statusId
                    }
                },
                OrderItems: {
                    create: data.orderItems
                },
                cost: data.cost
            }
        });

        return order;
    }

    public async getOrders() {
        const orders = await this.getClient().order.findMany({
            include: {
                OrderItems: {
                    include: {
                        food: true
                    }
                },
                Status: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return orders;
    }

    public async getOrder(id: number) {
        const order = await this.getClient().order.findUnique({
            include: {
                OrderItems: {
                    include: {
                        food: true
                    }
                },
                Status: true
            },
            where: {
                id: id
            }
        });

        return order;
    }
}
