import { foodSchema, getFood, editFood } from '$lib';
import { error } from 'console';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { z } from 'zod';

export const load = (async ({ params }) => {
    const foodId = Number(params.id);

    console.log('food/id/page.ts', 'hello?', foodId, isNaN(foodId));

    if (isNaN(foodId) === false) {
        const food = await getFood(foodId);
        if (food) {
            return {
                food
            };
        }
    }
    throw error(404, `Food (${foodId}) not found`);
}) satisfies PageServerLoad;

export const actions = {
    edit: async ({ request, params }) => {
        const foodId = Number(params.id);
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

        const result = foodSchema.safeParse(data);

        if (!result.success) {
            const errors: z.inferFlattenedErrors<typeof foodSchema> = result.error.flatten();

            return fail(400, {
                food: data,
                errors: errors,
                success: false
            });
        }

        const response = await editFood(foodId, {
            name: result.data.name,
            description: result.data.description,
            categoryId: result.data.categoryId,
            cost: result.data.cost
        });

        throw redirect(303, `/food/${response.id}`);
    }
} satisfies Actions;
