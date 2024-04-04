import type { PageServerLoad } from './$types';
import { categorySchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';

import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { superValidate } from 'sveltekit-superforms';
import type { FoodCategory } from '@prisma/client';
import type { Actions } from '../$types';
import { fail, redirect } from '@sveltejs/kit';

let category: FoodCategory;

export const load = (async () => {
	const form = await superValidate(zod(categorySchema));
	const categories = await foodCategoryModel.getAll();
	return {
		categories,
		form,
		category: category
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(categorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		category = await foodCategoryModel.create({
			...form.data,
			description: form.data.description || null
		});

		redirect(302, `/admin/categories/${category.id}`);
	}
} satisfies Actions;
