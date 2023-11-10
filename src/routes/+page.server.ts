import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib';
import type { Category, Food } from '@prisma/client';

export const load = (async () => {
    const categories: { [key: string]: [Food & { category: Category }] } = {};
    const status = await db.getStatuses();
    const foods = await db.getFoodsWithCategory({ statusId: 1 });
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
        console.log('pg-server-actions', await request.formData());
    }
} satisfies Actions;
