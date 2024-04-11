import { foodModel } from '$lib/db/models/food';
import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { foodStatusModel } from '$lib/db/models/foodStatus';
import type { Food, FoodCategory, FoodStatus } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

let categories: FoodCategory[];
let states: FoodStatus[];

export const load = (async () => {
	states = await foodStatusModel.getAll();
	categories = await foodCategoryModel.getAll();

	const foods = (await foodModel.getAll()) as unknown as (Food & {
		category: FoodCategory | undefined;
		status: FoodStatus | undefined;
	})[];

	/*
	foods.forEach(async (food) => {
		food.category = categories.find(
			(category) => category.id == food.categoryId
		);
		food.status = statuses.find((status) => status.id == food.statusId);
	});
	*/

	for (const food of foods) {
		food.category = categories.find(
			(category) => category.id === food.categoryId
		);
		food.status = states.find((status) => status.id === food.statusId);
	}

	return {
		states,
		categories,
		foods
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const data = Object.fromEntries(formData.entries()) as {
			name: string;
			price: string;
			categoryId: string | number;
			statusId: string | number;
			description: string;
			image: string;
		};

		const foodSchema = z.object({
			name: z.string().trim().min(1),
			price: z.coerce.number().min(0),
			categoryId: z.enum([
				categories[0].id.toString(),
				...categories
					.splice(1, categories.length)
					.map((category) => category.id.toString())
			]),
			statusId: z.enum([
				states[0].id.toString(),
				...states.splice(1, states.length).map((status) => status.id.toString())
			]),
			description: z.string().trim().optional(),
			image: z.string().optional()
		});

		const result = foodSchema.safeParse(data);

		if (!result.success) {
			const errors = result.error.formErrors.fieldErrors;
			return fail(400, { food: data, errors: errors });
		}

		const food = result.data;

		const theFood = await foodModel.create({
			name: food.name,
			description: food.description ?? '',
			price: food.price,
			categoryId: Number.parseFloat(data.categoryId.toString()),
			statusId: Number.parseFloat(data.statusId.toString()),
			image: food.image ?? ''
		});

		redirect(302, '/admin/food');
		// redirect(302, `/admin/food/${theFood.id}`);
	}
};
