import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib';
import type { Actions } from './$types';
import type { z } from 'zod';
import type { Food } from '@prisma/client';

export const load = (async ({ url }) => {
	const search: { [key: string]: number } = {};

	if (url.searchParams.has('category'))
		search.categoryId = Number(url.searchParams.get('category'));

	if (url.searchParams.has('status')) search.statusId = Number(url.searchParams.get('status'));

	return {
		foods: db.getFoods(search)
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		const data: Food = {
			name: formData.name as string,
			description: formData.description as string,
			categoryId: Number(formData.categoryId) as number,
			statusId: Number(formData.statusId) as number,
			cost: Number(formData.cost) as number
		};

		const result = db.foodSchema.safeParse(data);

		if (!result.success) {
			const errors: z.inferFlattenedErrors<typeof db.foodSchema> = result.error.flatten();

			return fail(400, {
				food: data,
				errors: errors,
				success: false
			});
		}

		const response = await db.createFood(result.data);

		throw redirect(303, `/food/${response.id}`);
	}
} satisfies Actions;
