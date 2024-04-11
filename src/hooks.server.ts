import { lucia } from '$lib/server/auth';
import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	/*

  */

	const sessionId = event.cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		const { session, user } = await lucia.validateSession(sessionId);

		if (session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(sessionId);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		event.locals.user = user;
		event.locals.session = session;
	}

	if (event.url.pathname.startsWith('/profile') && !event.locals.user) {
		throw redirect(303, `/login?r=${event.url.pathname}`);
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, `/login?r=${event.url.pathname}`);
		}

		if (event.locals.user.roleId !== 1) {
			throw redirect(303, `/admin?r=${event.url.pathname}`);
		}
	}

	return await resolve(event);
};
