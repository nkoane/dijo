import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFoodCategories, foodSchema, createFood } from '$lib';
import type { Actions } from './$types';
import type { z } from 'zod';

const categories = await getFoodCategories();

export const load = (async () => {
    return {
        foods: [],
        categories: categories
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

        const result = foodSchema.safeParse(data);

        if (!result.success) {
            const errors: z.inferFlattenedErrors<typeof foodSchema> = result.error.flatten();

            return fail(400, {
                ...data,
                errors: errors,
                success: false
            });
        }

        const response = await createFood({
            name: result.data.name,
            description: result.data.description,
            categoryId: result.data.categoryId,
            cost: result.data.cost
        });

        throw redirect(303, `/food/${response.id}`);
    }
} satisfies Actions;
