import { db } from '$lib';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const orders = await db.getOrders();
    return {
        orders: orders
    };
}) satisfies PageServerLoad;
