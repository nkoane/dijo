import { dbClient } from '../src/lib/db/client';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

const seedUserRoles = async () => {
	const roles = ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'customer'];
	for (let i = 0; i < roles.length; i++) {
		const result = await dbClient.roles.create({
			data: {
				name: roles[i]
			}
		});
		console.log('result: new role: ', result);
	}
};

const seedAdminUser = async () => {
	const generateRandomPassword = () => {
		const letters = 'abcdefghijklmnopqrstuvwxyz';
		const randomLetters = Array.from(
			{ length: 8 },
			() => letters[Math.floor(Math.random() * letters.length)]
		);
		return randomLetters.join('');
	};

	const password = generateRandomPassword();

	await dbClient.user.create({
		data: {
			id: generateId(15),
			username: 'root',
			hashed_password: await new Argon2id().hash(password),
			role: { connect: { name: 'admin' } }
		}
	});

	console.log('admin user, root — with password', password, ' has been created');
};

export async function seed() {
	console.log('seeding user roles, create admin user.');
	await seedUserRoles();
	await seedAdminUser();
}

await seed();
