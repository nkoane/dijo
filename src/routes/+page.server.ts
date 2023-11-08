import type { PageServerLoad } from './$types';
import { db } from '$lib';
import type { Category, Food } from '@prisma/client';

export const load = (async () => {
    const categories: { [key: string]: [Food & { category: Category }] } = {};
    (await db.getFoodsWithCategory({ statusId: 1 })).forEach((food) => {
        categories[food.category.name] = categories[food.category.name] ?? [];
        categories[food.category.name].push(food);
    });
    return {
        categories: categories
    };
}) satisfies PageServerLoad;
