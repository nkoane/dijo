import { db } from '$lib';
import type { Food } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { z } from 'zod';

export const load: PageServerLoad = async ({ params }) => {
    const food = await db.getFood(Number(params.id));

    if (!food) {
        throw error(404, 'Food not found');
    }

    return { food };
};

export const actions = {
    edit: async ({ request, params }) => {
        const foodId = Number(params.id);
        const formData = Object.fromEntries(await request.formData());

        const data: Food = {
            name: formData.name as string,
            description: formData.description as string,
            categoryId: Number(formData.categoryId) as number,
            statusId: Number(formData.statusId) as number,
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

        const response = await db.editFood(foodId, result.data);

        throw redirect(303, `/food/${response.id}`);
    }
} satisfies Actions;
