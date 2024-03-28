import type { Actions, PageServerLoad } from './$types';
import type { FoodCategory } from '@prisma/client';

import { foodCategoryModel } from '$lib/db/models/foodCategory';

export const load = (async () => {
	const categories = await foodCategoryModel.getAll();
	return {
		categories
	};
}) satisfies PageServerLoad;
