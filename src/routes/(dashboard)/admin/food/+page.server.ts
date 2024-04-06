import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { foodStatusModel } from '$lib/db/models/foodStatus';
import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { foodModel } from '$lib/db/models/food';
import type { Food, FoodCategory, FoodStatus } from '@prisma/client';
import { z } from 'zod';

let categories: FoodCategory[];
let statuses: FoodStatus[];

export const load = (async () => {
	statuses = await foodStatusModel.getAll();
	categories = await foodCategoryModel.getAll();

	const foods = (await foodModel.getAll()) as unknown as (Food & {
		category: FoodCategory | undefined;
		status: FoodStatus | undefined;
	})[];

	foods.forEach(async (food) => {
		food.category = categories.find((category) => category.id == food.categoryId);
		food.status = statuses.find((status) => status.id == food.statusId);
	});

	return {
		statuses,
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
			// todo: not sure WTF is this a problem
			categoryId: z.enum(categories.map((category) => category.id.toString())),
			statusId: z.enum(statuses.map((status) => status.id.toString())),
			description: z.string().trim().optional(),
			image: z.string().optional()
		});

		const result = foodSchema.safeParse(data);

		if (!result.success) {
			const errors: { [key: string]: string[] } = {};
			const formattedErrors = result.error.format();

			Object.keys(data).forEach((objectKey) => {
				if (formattedErrors[objectKey]) {
					errors[objectKey] = formattedErrors[objectKey]._errors;
				}
			});
			return fail(400, { food: data, errors: errors });
		}

		const food = result.data;

		const theFood = await foodModel.create({
			name: food.name,
			description: food.description ?? '',
			price: food.price,
			categoryId: parseFloat(data.categoryId.toString()),
			statusId: parseFloat(data.statusId.toString()),
			image: food.image ?? ''
		});

		redirect(302, `/admin/food`);
		// redirect(302, `/admin/food/${theFood.id}`);
	}
};
