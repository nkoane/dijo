import { db } from '$lib';
import type { LayoutServerLoad } from './$types';

const categories = await db.getFoodCategories();
const statuses = await db.getFoodStatuses();

export const load = (async () => {
	return {
		categories,
		statuses
	};
}) satisfies LayoutServerLoad;
