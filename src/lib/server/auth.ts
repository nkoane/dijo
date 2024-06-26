import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { dbClient } from '$lib/db/client';

const adapter = new PrismaAdapter(dbClient.userSession, dbClient.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
			sameSite: 'strict'
		}
	},
	getUserAttributes(attributes) {
		const { username, roleId, stateId } = attributes;
		return {
			username,
			roleId,
			stateId
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
	stateId: number;
	role: {
		id: number;
		name: string;
	};
	state: {
		id: number;
		status: string;
	};
}
