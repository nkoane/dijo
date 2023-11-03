import { getFoodCategories } from '$lib';
import type { LayoutServerLoad } from './$types';

const categories = await getFoodCategories();

export const load = (async () => {
    return {
        categories
    };
}) satisfies LayoutServerLoad;
