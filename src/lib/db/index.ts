import type { Food, FoodCategory, FoodStatus, Order, OrderItem, OrderStatus } from '@prisma/client';

export type FoodDetail = Food & { status: FoodStatus; category: FoodCategory };
export type OrderItemDetail = OrderItem & { food: FoodDetail };
export type OrderDetail = Order & { items: OrderItemDetail[]; status: OrderStatus };
export type Orders = { [key: string]: OrderDetail[] };

export type FoodMenu = { [key: string]: FoodDetail[] };

export function createTimeDifference(
	id: number,
	date: Date
): {
	id: number;
	date: Date;
	diff: { seconds: number; minutes: number; hours: number; days: number; value: number };
	words: string;
} {
	const diff = new Date().getTime() - new Date(date).getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const words = `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;

	return {
		id,
		date,
		diff: {
			seconds,
			minutes,
			hours,
			days,
			value: diff
		},
		words
	};
}
