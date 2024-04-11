import { people } from '$lib/db/controllers/people';
import { userRepository } from '$lib/db/repositories/UserRepository';
import type { Actions, PageServerLoad } from './$types';

import { superValidate } from 'sveltekit-superforms';
import { getStaffSchema, type StaffSchema } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import type { UserRole, UserStatus } from '@prisma/client';
import { userModel } from '$lib/db/models/user';

let staffSchema: StaffSchema;
let roles: UserRole[];
let states: UserStatus[];

export const load = (async ({ locals }) => {
	const staff = await people.getAll();
	roles = (await userRepository.getAllRoles(locals.user?.roleId)).sort((a, b) => b.id - a.id);
	states = await userRepository.getAllStates();
	staffSchema = getStaffSchema(roles, states);

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
		if (!form.valid) {
			return fail(400, { form });
		}

		const person = form.data;

		const result = await userRepository.create({
			username: person.username,
			password: person.password,
			role: roles.find((role) => role.id.toString() === person.roleId)!.name,
			state: states.find((state) => state.id.toString() === person.stateId)!.state
		});

		if (!result.success) {
			return fail(500, { form, message: result.errors });
		}

		redirect(302, `/admin/staff/${result.data?.id}`);
	}
} satisfies Actions;
