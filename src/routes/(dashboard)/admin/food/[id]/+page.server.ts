import { foodManagement } from '$lib/db/models/food';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';

let foodId: number;

export const load: PageServerLoad = async ({ params }) => {
	const id = parseFloat(params.id);

	if (isNaN(id)) {
		error(400, 'id must be a number');
	}

	const food = await foodManagement.getById(id);

	if (!food) {
		error(404, 'no such food item');
	}

	foodId = id;

	const statuses = await foodManagement.getAllFoodStatus();
	const categories = await foodManagement.getAllFoodCategory();

	return { food, statuses, categories };
};

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

		await foodManagement.update(foodId, {
			name: food.name as string,
			description: food.description as string,
			price: food.price as number,
			category: food.category as number,
			status: food.status as number,
			image: food.image as string | ''
		});
	}
};
