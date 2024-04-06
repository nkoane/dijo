import { people } from '$lib/db/controllers/people';
import { userRoleModel } from '$lib/db/models/userRole';
import { userRepository } from '$lib/db/repositories/UserRepository';
import type { c } from 'vite/dist/node/types.d-aGj9QkWt';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms';
//import { staffSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const userRoles = await userRoleModel.getAll();
const userStates = await userRepository.getAllStates();

const staffSchema = z.object({
	firstName: z.string().trim().min(4),
	lastName: z.string().trim().min(8),
	roleId: z.enum(userRoles.map((role) => role.id.toString())),
	stateId: z.enum(userStates.map((state) => state.id.toString()))
});

export const load = (async ({ locals }) => {
	const staff = await people.getAll();
	const roles = await userRepository.getAllRoles(locals.user?.roleId);
	const states = await userRepository.getAllStates();

	const form = await superValidate(zod(staffSchema));

	return {
		staff,
		roles,
		states,
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(staffSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		/*
		const staff = await foodCategoryModel.create({
			...form.data,
			description: form.data.description || null
		});

		redirect(302, `/admin/categories/${staff.id}`);
		*/
	}
} satisfies Actions;
