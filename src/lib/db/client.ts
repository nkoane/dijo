import prisma from '@prisma/client';

class Database {
	private static instance: Database;
	private prismaClient: prisma.PrismaClient;

	private constructor() {
		this.prismaClient = new prisma.PrismaClient({
			// log: ['query', 'info', 'warn', 'error']
		});
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
			console.log('lib/db/client: database instance created.');
		}
		return Database.instance;
	}

	public getPrismaClient(): prisma.PrismaClient {
		return this.prismaClient;
	}
}

export const dbClient = Database.getInstance().getPrismaClient();
