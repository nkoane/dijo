import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userRepository, type UserDetail } from '$lib/db/repositories/UserRepository';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { getStaffSchema, type StaffSchema } from '$lib/schemas';

let id: string;
let staff: UserDetail;
let staffSchema: StaffSchema;

export const load = (async ({ params, locals }) => {
	id = params.id;

	if (!id) {
		error(404, 'id does not exist');
	}

	try {
		staff = await userRepository.get(id);
		const roles = await userRepository.getAllRoles(locals.user?.roleId);
		const states = await userRepository.getAllStates();

		staffSchema = getStaffSchema(roles, states);
		const form = await superValidate(
			{
				username: staff.username,
				roleId: staff.roleId.toString(),
				stateId: staff.stateId.toString()
			},
			zod(staffSchema)
		);

		console.log(staff);

		return {
			form,
			staff,
			roles,
			states
		};
	} catch (errors) {
		console.error('(dashboard) admin staff [id] +page.server.ts', errors);
		error(404, 'no such person');
	}
}) satisfies PageServerLoad;
