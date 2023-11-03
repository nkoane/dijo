import { getFood } from '$lib';
import { error } from 'console';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const foodId = Number(params.id);

    console.log('food/id/page.ts', 'hello?', foodId, isNaN(foodId));

    if (isNaN(foodId) === false) {
        const food = await getFood(foodId);
        console.log('We got the meats', food);
        if (food) {
            return {
                food
            };
        }
    }
    throw error(404, `Food (${foodId}) not found`);
}) satisfies PageServerLoad;
