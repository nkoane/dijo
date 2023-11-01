import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Food, getFoodCategories } from '$lib';
import type { Actions } from './$types';

export const load = (async () => {
    return {
        foods: [],
        categories: getFoodCategories()
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const errors = [];
        const name = (data.get('name') as string).trim();
        const description = (data.get('description') as string).trim();
        const categoryId = data.get('categoryId');
        const cost = data.get('cost');

        if (!name && name?.trim() == '') errors.push({ name: 'missing' });
        if (isNaN(Number(cost))) errors.push({ cost: 'invalid' });
        if (isNaN(Number(categoryId))) errors.push({ categoryId: 'invalid' });

        console.log(
            `name: ${name}, description: ${description}, categoryId: ${categoryId}, cost: ${cost}`
        );
        // check if const is valid number

        const food: Food = {
            name,
            description,
            categoryId: Number(categoryId),
            cost: Number(cost)
        };

        if (errors.length > 0) {
            return fail(400, errors);
        }

        return { ...food, success: true };
    }
} satisfies Actions;
