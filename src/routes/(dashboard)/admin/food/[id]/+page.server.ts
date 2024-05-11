import { foodModel } from '$lib/db/models/food';
import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { foodStatusModel } from '$lib/db/models/foodStatus';
import type { Food, FoodCategory, FoodStatus } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';

let id: number;
let categories: FoodCategory[];
let states: FoodStatus[];

export const load: PageServerLoad = async ({ params }) => {
	id = Number.parseFloat(params.id);

	if (Number.isNaN(id)) {
		error(400, 'id must be a number');
	}

	const food = (await foodModel.getById(id)) as unknown as
		| (Food & {
				category: FoodCategory | undefined;
				status: FoodStatus | undefined;
		  })
		| null;

	if (!food) {
		error(404, 'no such food item');
	}

	states = await foodStatusModel.getAll();
	categories = await foodCategoryModel.getAll();

	food.category = categories.find(
		(category) => category.id === food.categoryId
	);
	food.status = states.find((status) => status.id === food.statusId);

	return { food, states, categories };
};

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
			] as const),
			statusId: z.enum([
				states[0].id.toString(),
				...states.splice(1, states.length).map((status) => status.id.toString())
			] as const),
			description: z.string().trim().optional(),
			image: z.string().optional()
		});

		const result = foodSchema.safeParse(data);

		if (!result.success) {
			const errors = result.error.formErrors.fieldErrors;
			return fail(400, { food: data, errors: errors });
		}

		console.log(result.data, data);

		const food = result.data;

		await foodModel.update(id, {
			name: food.name,
			description: food.description,
			price: food.price,
			categoryId: Number.parseFloat(data.categoryId.toString()),
			statusId: Number.parseFloat(data.statusId.toString())
		});
	}
};
