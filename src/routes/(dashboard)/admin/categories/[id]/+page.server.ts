import { categorySchema } from '$lib/schemas';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

import { foodCategoryModel } from '$lib/db/models/foodCategory';
import type { FoodCategory } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import type { Actions } from '../$types';

let id: number;
let category: FoodCategory;

export const load = (async ({ params }) => {
	id = Number.parseFloat(params.id);

	if (Number.isNaN(id) || !id) {
		error(404, 'id must be a number');
	}

	try {
		category = await foodCategoryModel.getById(id);

		const form = await superValidate(
			{
				name: category.name ?? undefined,
				description: category.description ?? undefined
			},
			zod(categorySchema)
		);
		return {
			form,
			category,
			foods: await foodCategoryModel.getFoods(id)
		};
	} catch (errors) {
		error(404, 'no such category');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(categorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await foodCategoryModel.update(id, {
			...form.data,
			description: form.data.description ?? null
		});

		return message(form, 'Category edited successfully!');
	}
} satisfies Actions;
