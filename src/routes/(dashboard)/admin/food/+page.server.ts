import { foodManagement } from '$lib/db/food';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const foods = await foodManagement.getAll();

	const statuses = await foodManagement.getAllFoodStatus();
	const categories = await foodManagement.getAllFoodCategory();
	return {
		statuses,
		categories,
		foods
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	add: async ({ request }) => {
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

		const two = '2';

		// convert two into a number
		const twoAsNumber = parseFloat(two);

		console.log(two, twoAsNumber);

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
			console.log('errors', errors);
			return fail(400, { food, errors });
		}

		console.clear();

		const result = await foodManagement.create({
			name: food.name as string,
			description: food.description as string,
			price: food.price as number,
			category: food.category as number,
			status: food.status as number,
			image: food.image as string | null
		});
		console.log('new food added', result);
		redirect(302, `/admin/food/${result.id}`);
	}
};
