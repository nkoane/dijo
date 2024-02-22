import { dbClient } from '../src/lib/db/client';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

const seedUserRoles = async () => {
	const rolesAlreadyExist = await dbClient.roles.findMany();
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
		const result = await dbClient.roles.create({
			data: {
				name: roles[i]
			}
		});
		console.log('result: new role: ', result);
	}
};

const seedFoodCategories = async () => {
	const categoriesAlreadyExist = await dbClient.category.findMany();
	const categories = ['Starch', 'Meat', 'Vegetables', 'Drinks'];

	for (let i = 0; i < categoriesAlreadyExist.length; i++) {
		const category = categoriesAlreadyExist[i];
		const index = categories.indexOf(category.name);
		if (index > -1) {
			categories.splice(index, 1);
		}
	}

	if (categories.length === 0) {
		console.log('food categories already exist');
		return;
	}

	for (let i = 0; i < categories.length; i++) {
		const result = await dbClient.category.create({
			data: {
				name: categories[i]
			}
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

const seedAdminUser = async () => {
	const rootAlreadyExists = await dbClient.user.findFirst({
		where: {
			username: 'root'
		}
	});

	if (rootAlreadyExists) {
		console.log('admin user, root already exists');
		return;
	}

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
	console.log('seeding: user roles, food categories, order statuses, food statuses, admin user');
	await seedUserRoles();
	await seedFoodCategories();
	await seedOrderStatus();
	await seedFoodStatus();
	await seedAdminUser();
}

await seed();
