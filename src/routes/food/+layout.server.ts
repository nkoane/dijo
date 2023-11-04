import { db } from '$lib';
import type { LayoutServerLoad } from './$types';

const categories = await db.getFoodCategories();

export const load = (async () => {
    return {
        categories
    };
}) satisfies LayoutServerLoad;
