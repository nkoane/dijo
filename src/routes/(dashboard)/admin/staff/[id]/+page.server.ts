import {
	type UserDetail,
	userRepository
} from '$lib/db/repositories/UserRepository';
import { type StaffSchema, getStaffSchema } from '$lib/schemas';
import type { UserRole, UserStatus } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

let id: string;
let person: UserDetail;
let staffSchema: StaffSchema;
let roles: UserRole[];
let states: UserStatus[];

export const load = (async ({ params, locals }) => {
	id = params.id;

	if (!id) {
		error(404, 'id does not exist');
	} else if (id === locals.user?.id.toString()) {
		redirect(302, '/profile');
	}

	try {
		person = await userRepository.get(id);
		roles = (await userRepository.getAllRoles(locals.user?.roleId)).sort(
			(a, b) => b.id - a.id
		);
		states = await userRepository.getAllStates();

		staffSchema = getStaffSchema(roles, states);
		const form = await superValidate(
			{
				id: person.id.toString(),
				username: person.username,
				roleId: person.roleId.toString(),
				stateId: person.stateId.toString()
			},
			zod(staffSchema)
		);

		return {
			form,
			person,
			roles,
			states
		};
	} catch (errors) {
		error(404, 'no such person');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		formData.set('id', id);

		const form = await superValidate(formData, zod(staffSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		const person = form.data;

		const result = await userRepository.modify(id, {
			username: person.username,
			password: person.password,
			roleId: person.roleId,
			stateId: person.stateId
		});

		if (!result.success) {
			return fail(500, { form, message: result.errors });
		}
	}
} satisfies Actions;
