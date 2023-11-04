import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib';
import type { Actions } from './$types';
import type { z } from 'zod';

export const load = (async ({ url }) => {
    let categoryId: number | null = null;

    if (url.searchParams.has('category')) {
        categoryId = Number(url.searchParams.get('category'));
    }

    const foods = await db.getFoods(categoryId);

    if (foods.length == 0) {
        throw error(404, `Category (${categoryId}) not found`);
    }

    return {
        foods: db.getFoods(categoryId)
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        const data: {
            name: string;
            description: string;
            categoryId: number;
            cost: number;
        } = {
            name: formData.name as string,
            description: formData.description as string,
            categoryId: Number(formData.categoryId) as number,
            cost: Number(formData.cost) as number
        };

        const result = db.foodSchema.safeParse(data);

        if (!result.success) {
            const errors: z.inferFlattenedErrors<typeof db.foodSchema> = result.error.flatten();

            return fail(400, {
                food: data,
                errors: errors,
                success: false
            });
        }

        const response = await db.createFood({
            name: result.data.name,
            description: result.data.description,
            categoryId: result.data.categoryId,
            cost: result.data.cost
        });

        throw redirect(303, `/food/${response.id}`);
    }
} satisfies Actions;
