import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { foodStatusModel } from '$lib/db/models/foodStatus';
import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { foodModel } from '$lib/db/models/food';
import type { Food, FoodCategory, FoodStatus } from '@prisma/client';

export const load = (async () => {
	const statuses = await foodStatusModel.getAll();
	const categories = await foodCategoryModel.getAll();

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
		const data = await request.formData();
		const name = data.get('name') as string;
		const description = data.get('description') as string;
		const price = data.get('price') as unknown as number;
		const category = data.get('category') as unknown as number;
		const status = data.get('status') as unknown as number;
		const image = data.get('image') as string | null;

		const food: { [key: string]: string | number | null } = {
			name,
			description,
			price: parseFloat(price.toString()),
			category: parseFloat(category.toString()),
			status: parseFloat(status.toString()),
			image: image ? image.toString() : null
		};

		const errors: { [key: string]: string | number | unknown } = {};

		Object.keys(food).forEach((key) => {
			if (key == 'image' || key == 'description') return;

			if (food[key] == null || food[key] == '') {
				errors[key] = `${key} is required`;
			}

			if (key == 'price' && food[key] != null) {
				const price = food[key] as number;
				if (isNaN(price)) {
					errors[key] = `${key} must be a number`;
				} else if (price < 0) {
					errors[key] = `${key} must be greater than 0`;
				}
			}
		});

		if (Object.keys(errors).length > 0) {
			return fail(400, { food, errors });
		}

		const result = await foodModel.create({
			name: food.name as string,
			description: food.description as string,
			price: food.price as number,
			category: food.category as number,
			status: food.status as number,
			image: food.image as string | null
		});

		redirect(302, `/admin/food/${result.id}`);
	}
};
