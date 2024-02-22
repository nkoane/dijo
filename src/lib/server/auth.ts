import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { dbClient } from '$lib/db/client';

const adapter = new PrismaAdapter(dbClient.session, dbClient.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
			sameSite: 'strict'
		}
	},
	getUserAttributes(attributes) {
		const { username, roleId, role } = attributes;
		return {
			username,
			roleId,
			role
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	roleId: number;
	role: {
		id: number;
		name: string;
	};
}
