import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createFood, getFoodCategories, foodSchema } from '$lib';
import type { Actions } from './$types';
import { z } from 'zod';

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

        try {
            const result = foodSchema.safeParse(data);

            if (!result.success) {
                const errors: z.inferFlattenedErrors<typeof foodSchema> = result.error.flatten();

                return fail(400, {
                    ...data,
                    errors: errors,
                    success: false
                });
            }

            const response = await createFood(result);

            console.log('we is good', result, response);
            // return { success: true };
        } catch (e) {
            if (e instanceof z.ZodError) {
                const formatted = e.format();
                return fail(400, { errors: formatted, success: false });
            }
        }
    }
} satisfies Actions;
