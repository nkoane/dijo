import { superValidate, message } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { categorySchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';

import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { error, fail } from '@sveltejs/kit';
import type { FoodCategory } from '@prisma/client';
import type { Actions } from '../$types';

let id: number;
let category: FoodCategory;

export const load = (async ({ params }) => {
	id = parseFloat(params.id);

	if (isNaN(id) || !id) {
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
		console.error('(dashboard) admin categories [id] +page.server.ts', errors);
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
