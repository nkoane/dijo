import { foodModel } from '$lib/db/models/food';
import { foodCategoryModel } from '$lib/db/models/foodCategory';
import { foodStatusModel } from '$lib/db/models/foodStatus';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import type { Food, FoodStatus, FoodCategory } from '@prisma/client';
import { z } from 'zod';

let id: number;
let categories: FoodCategory[];
let statuses: FoodStatus[];

export const load: PageServerLoad = async ({ params }) => {
	id = parseFloat(params.id);

	if (isNaN(id)) {
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

	statuses = await foodStatusModel.getAll();
	categories = await foodCategoryModel.getAll();

	food.category = categories.find((category) => category.id == food.categoryId);
	food.status = statuses.find((status) => status.id == food.statusId);

	return { food, statuses, categories };
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
			// todo: not sure WTF is this a problem
			categoryId: z.enum(categories.map((category) => category.id.toString())),
			statusId: z.enum(statuses.map((status) => status.id.toString())),
			description: z.string().trim().optional(),
			image: z.string().optional()
		});

		const result = foodSchema.safeParse(data);

		if (!result.success) {
			const errors = {
				name: [],
				price: [],
				categoryId: [],
				statusId: []
			};
			const formattedErrors = result.error.format();

			Object.keys(data).forEach((objectKey) => {
				if (formattedErrors[objectKey]) {
					errors[objectKey] = formattedErrors[objectKey]._errors;
				}
			});
			return fail(400, { food: data, errors: errors });
		}

		const food = result.data;

		await foodModel.update(id, {
			name: food.name,
			description: food.description,
			price: food.price,
			categoryId: parseFloat(data.categoryId.toString()),
			statusId: parseFloat(data.statusId.toString())
		});
	}
};
