import { foodManagement } from '$lib/db/food';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const foods = await foodManagement.getAll();
	return {
		foods
	};
}) satisfies PageServerLoad;
