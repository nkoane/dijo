import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { foodManagement } from '$lib/db/food';
import type { Food } from '@prisma/client';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/login?redirect=/menu');
	}

	const dijo: Record<string, Food[]> = {};
	const foods = await foodManagement.getAvailableFoods();
	foods?.forEach((food) => {
		if (!dijo[food.category.name]) {
			dijo[food.category.name] = [];
		}
		dijo[food.category.name].push(food);
	});

	return {
		dijo
	};
}) satisfies PageServerLoad;
