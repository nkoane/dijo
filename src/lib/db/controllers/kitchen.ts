import { orderRepository, type Orders } from '../repositories/OrderRepository';

class Kitchen {
	private static instance: Kitchen;
	private orders: Orders = {};

	private constructor() {}

	public static getInstance(): Kitchen {
		if (!Kitchen.instance) {
			Kitchen.instance = new Kitchen();
		}
		return Kitchen.instance;
	}

	/* limit to just: placed (placed + paid), preparing, ready */
	public async getOrders(): Promise<Orders> {
		const states = ['placed', 'paid', 'preparing', 'ready'];
		this.orders = await orderRepository.getOrders(states);

		return this.orders;
	}
}

export const kitchen = Kitchen.getInstance();
