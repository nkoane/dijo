import type { Actions, PageServerLoad } from './$types';
import type { FoodCategory } from '@prisma/client';
import { z } from 'zod';

import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { describe } from 'node:test';

const CatagorySchema = z.object({
	name: z.string().trim().min(1),
	describe: z.string().trim().optional()
});

export const load = (async () => {
	const categories = await foodCategoryModel.getAll();
	return {
		categories
	};
}) satisfies PageServerLoad;
