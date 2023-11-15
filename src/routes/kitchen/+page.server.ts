import { db } from '$lib';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    const orders = await db.getOrders();
    return {
        orders: orders
    };
};

export const actions = {
    prepare: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (id === null || isNaN(id) == true)
            return { success: false, message: 'Invalid order id' };

        const status = await db.getOrderStatus({ state: 'preparing' });

        if (status === null) return { success: false, message: 'Invalid order status' };

        const result = await db.updateOrderStatus(id, status.id);

        return { success: true, order: result };
    },
    ready: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (id === null || isNaN(id) == true)
            return { success: false, message: 'Invalid order id' };

        const status = await db.getOrderStatus({ state: 'ready' });

        if (status === null) return { success: false, message: 'Invalid order status' };

        const result = await db.updateOrderStatus(id, status.id);

        return { success: true, order: result };
    },
    collected: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (id === null || isNaN(id) == true)
            return { success: false, message: 'Invalid order id' };

        const status = await db.getOrderStatus({ state: 'collected' });

        if (status === null) return { success: false, message: 'Invalid order status' };

        const result = await db.updateOrderStatus(id, status.id);

        return { success: true, order: result };
    },
    delivered: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (id === null || isNaN(id) == true)
            return { success: false, message: 'Invalid order id' };

        const status = await db.getOrderStatus({ state: 'delivered' });

        if (status === null) return { success: false, message: 'Invalid order status' };

        const result = await db.updateOrderStatus(id, status.id);

        return { success: true, order: result };
    },
    cancel: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (id === null || isNaN(id) == true)
            return { success: false, message: 'Invalid order id' };

        const status = await db.getOrderStatus({ state: 'cancelled' });

        if (status === null) return { success: false, message: 'Invalid order status' };

        const result = await db.updateOrderStatus(id, status.id);

        return { success: true, order: result };
    }
} satisfies Actions;
