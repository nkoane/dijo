import { dbClient } from '../src/lib/db/client';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

const seedUserRoles = async () => {
	const rolesAlreadyExist = await dbClient.userRole.findMany();
	const roles = ['admin', 'manager', 'cashier', 'kitchen', 'waiter', 'customer'];

	for (let i = 0; i < rolesAlreadyExist.length; i++) {
		const role = rolesAlreadyExist[i];
		const index = roles.indexOf(role.name);
		if (index > -1) {
			roles.splice(index, 1);
		}
	}

	if (roles.length === 0) {
		console.log('user roles already exist');
		return;
	}

	for (let i = 0; i < roles.length; i++) {
		const result = await dbClient.userRole.create({
			data: {
				name: roles[i]
			}
		});
		console.log('result: new role: ', result);
	}
};

const seedUserStates = async () => {
	const currentStates = await dbClient.userStatus.findMany();
	const states = ['registering', 'active', 'inactive', 'banned'];

	for (let i = 0; i < currentStates.length; i++) {
		const state = currentStates[i];
		const index = states.indexOf(state.state);
		if (index > -1) {
			states.splice(index, 1);
		}
	}

	if (states.length === 0) {
		console.log('user state already exist');
		return;
	}

	for (let i = 0; i < states.length; i++) {
		const result = await dbClient.userStatus.create({
			data: {
				state: states[i]
			}
		});
		console.log('result: new state: ', result);
	}
};

const seedFoodCategories = async () => {
	const categoriesAlreadyExist = await dbClient.foodCategory.findMany();
	const categories = [
		{ name: 'basic', description: 'random things, possibly illegal too, lol.' },
		{ name: 'starch', description: 'all those un-taxed things' },
		{ name: 'meat', description: 'we have the meats' },
		{ name: 'vegetables', description: 'it is greener on the other side' },
		{ name: 'drinks', description: 'things to wash it down with' },
		{ name: 'perishables', description: 'things that go bad quickly' }
	];

	for (let i = 0; i < categoriesAlreadyExist.length; i++) {
		const category = categoriesAlreadyExist[i];
		const index = categories.findIndex((c) => c.name === category.name);

		if (index > -1) {
			categories.splice(index, 1);
		}
	}

	if (categories.length === 0) {
		console.log('food categories already exist');
		return;
	}

	for (let i = 0; i < categories.length; i++) {
		const result = await dbClient.foodCategory.create({
			data: categories[i]
		});
		console.log('result: new category: ', result);
	}
};

const seedOrderStatus = async () => {
	const statusesAlreadyExist = await dbClient.orderStatus.findMany();
	const statuses = [
		'placed',
		'paid',
		'preparing',
		'ready',
		'delivered',
		'collected',
		'cancelled',
		'refunded',
		'completed'
	];

	for (let i = 0; i < statusesAlreadyExist.length; i++) {
		const status = statusesAlreadyExist[i];
		const index = statuses.indexOf(status.state);
		if (index > -1) {
			statuses.splice(index, 1);
		}
	}

	if (statuses.length === 0) {
		console.log('order statuses already exist');
		return;
	}

	for (let i = 0; i < statuses.length; i++) {
		const result = await dbClient.orderStatus.create({
			data: {
				state: statuses[i]
			}
		});
		console.log('result: new status: ', result);
	}
};

const seedFoodStatus = async () => {
	const statusesAlreadyExist = await dbClient.foodStatus.findMany();
	const statuses = ['available', 'unavailable', 'out of stock'];

	for (let i = 0; i < statusesAlreadyExist.length; i++) {
		const status = statusesAlreadyExist[i];
		const index = statuses.indexOf(status.state);
		if (index > -1) {
			statuses.splice(index, 1);
		}
	}

	if (statuses.length === 0) {
		console.log('food statuses already exist');
		return;
	}

	for (let i = 0; i < statuses.length; i++) {
		const result = await dbClient.foodStatus.create({
			data: {
				state: statuses[i]
			}
		});
		console.log('result: new status: ', result);
	}
};

const resetUserSessions = async () => {
	const sessions = await dbClient.userSession.findMany();
	if (sessions.length === 0) {
		console.log('user sessions are already empty');
		return;
	}

	await dbClient.userSession.deleteMany();
	console.log('user sessions have been cleared');
};

const seedAdminUser = async (reset: boolean = false, password?: string) => {
	const rootAlreadyExists = await dbClient.user.findFirst({
		where: {
			username: 'root'
		}
	});

	password = password ?? 'dijo-tse-monate';

	if (rootAlreadyExists) {
		console.log('admin user, root already exists');
		if (reset === true) {
			console.log('we are bout to change the admin password with', password);

			await dbClient.user.update({
				where: {
					id: rootAlreadyExists.id
				},
				data: {
					hashed_password: await new Argon2id().hash(password),
					state: { connect: { state: 'active' } }
				}
			});
			console.log('admin user, root — with password', password, ' has been reset');
		}
		return;
	}

	await dbClient.user.create({
		data: {
			id: generateId(15),
			username: 'root',
			hashed_password: await new Argon2id().hash(password),
			state: { connect: { state: 'active' } },
			role: { connect: { name: 'admin' } }
		}
	});

	console.log('admin user, root — with password', password, ' has been created');
};

export async function seed() {
	const args = process.argv.slice(2);
	console.log(
		'seeding: user roles, food categories, order statuses, food statuses, admin user',
		args
	);
	// user stuff;

	await seedUserRoles();
	await seedUserStates();

	// food stuff
	await seedFoodCategories();
	await seedFoodStatus();

	// order stuff
	await seedOrderStatus();

	// admin user
	await seedAdminUser(args.includes('reset-admin-password'), args[1] ?? null);

	// reset user sessions
	await resetUserSessions();
}

await seed();
