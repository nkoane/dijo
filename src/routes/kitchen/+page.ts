import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
    console.log('kitchen/page/server', data.orders[0].createdAt);

    return {
        orders: data.orders
    };
};
