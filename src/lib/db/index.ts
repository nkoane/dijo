import type { Food, FoodCategory, FoodStatus, Order, OrderItem, OrderStatus } from '@prisma/client';

export type FoodDetail = Food & { status: FoodStatus; category: FoodCategory };
export type OrderItemDetail = OrderItem & { food: FoodDetail };
export type OrderDetail = Order & { items: OrderItemDetail[]; status: OrderStatus };
export type Orders = { [key: string]: OrderDetail[] };

export type FoodMenu = { [key: string]: FoodDetail[] };
