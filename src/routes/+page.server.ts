import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib';
import type { Category, Food } from '@prisma/client';
import { z } from 'zod';

const foods = await db.getFoodsWithCategory({ statusId: 1 });
const status = await db.getStatuses();

export const load = (async () => {
    const categories: { [key: string]: [Food & { category: Category }] } = {};
    foods.forEach((food) => {
        categories[food.category.name] = categories[food.category.name] ?? [];
        categories[food.category.name].push(food);
    });
    return {
        categories: categories,
        foods: foods,
        status: status
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const orderItems: { foodId: number; quantity: number; cost: number }[] = [];
        const itemRegex = /^item\[(\d+)\]$/;

        for (const [key, value] of formData.entries()) {
            if (Number(value) > 0) {
                const match = itemRegex.exec(key);
                if (match) {
                    const food = foods.find((food) => food.id === Number(match[1]));
                    if (food) {
                        orderItems.push({
                            foodId: z.coerce.number().parse(match[1]),
                            quantity: z.coerce.number().parse(value),
                            cost: food.cost
                        });
                    }
                }
            }
        }

        if (orderItems.length === 0) {
            return {
                success: false,
                errors: {
                    items: ['You must select at least one item.']
                }
            };
        }

        const order = {
            statusId: status.find((status) => status.state === 'placed')?.id ?? 3,
            orderItems: orderItems,
            cost: orderItems.reduce((acc, item) => acc + item.cost * item.quantity, 0)
        };

        const response = await db.createOrder(order);
        console.log(response);

        return { success: true, order: response };
    }
} satisfies Actions;
