import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFoodCategories } from '$lib';
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
        const data = Object.fromEntries(await request.formData());

        //const categoryIds = categories.map((c) => Number(c.id));

        try {
            const Food = z.object({
                name: z.string().trim().min(1),
                description: z.string().trim().optional(),
                categoryId: z.coerce.number(), // (categoryIds),
                cost: z.coerce.number().positive()
            });

            const result = Food.safeParse(data);

            if (!result.success) {
                const errors = result.error.errors.map((error) => {
                    return {
                        field: error.path[0],
                        message: error.message
                    };
                });

                return fail(400, {
                    ...data,
                    errors,
                    success: false
                });
            }

            console.log('we is good', result);
            return { success: true };
        } catch (e) {
            if (e instanceof z.ZodError) {
                const formatted = e.format();
                return fail(400, { errors: formatted, success: false });
            }
        }
    }
} satisfies Actions;
