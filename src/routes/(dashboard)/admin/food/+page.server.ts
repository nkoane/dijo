import { foodManagement } from '$lib/db/food';
import type { PageServerLoad } from './$types';

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
