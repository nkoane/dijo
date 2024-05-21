import {
	type UserDetail,
	userRepository,
} from "$lib/db/repositories/UserRepository";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
	if (!locals.user) {
		redirect(303, "/login?redirect=/profile");
	}

	const account: UserDetail = await userRepository.get(locals.user.id);

	return {
		account,
	};
}) satisfies PageServerLoad;
