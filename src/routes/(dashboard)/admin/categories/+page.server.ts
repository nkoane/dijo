import type { PageServerLoad } from './$types';
import { CategorySchema } from '$lib/schemas/forms';
import { zod } from 'sveltekit-superforms/adapters';

import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { superValidate } from 'sveltekit-superforms';

export const load = (async () => {
	const form = await superValidate(zod(CategorySchema));
	const categories = await foodCategoryModel.getAll();
	return {
		categories,
		form
	};
}) satisfies PageServerLoad;
