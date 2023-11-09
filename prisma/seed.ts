import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const foodStatuses = [
    {
        id: 1,
        state: 'available',
        description: 'Food is available'
    },
    {
        id: 2,
        state: 'soldout',
        description: 'Food is sold out'
    },
    {
        id: 3,
        state: 'outofstock',
        description: 'Food is out of stock'
    },
    {
        id: 4,
        state: 'discontinued',
        description: 'Food is discontinued'
    }
];

const orderStatuses = [
    {
        id: 1,
        state: 'pending',
        description: 'Order has been placed but not paid for'
    },
    {
        id: 2,
        state: 'paid',
        description: 'Order has been paid for'
    },
    {
        id: 3,
        state: 'preparing',
        description: 'Order is being prepared'
    },
    {
        id: 4,
        state: 'ready',
        description: 'Order is ready for collection'
    },
    { id: 5, state: 'delivered', description: 'Order has been delivered' },
    {
        id: 6,
        state: 'collected',
        description: 'Order has been collected'
    },
    {
        id: 7,
        state: 'canceled',
        description: 'Order has been canceled'
    }
];

const categories = [
    /*'starch', 'meat', 'vegetable', 'drink'*/
    {
        name: 'starch',
        description: 'it is either pap, rice, stampa/samp, ledombolo, etc'
    },
    {
        name: 'meat',
        description: 'it is either chicken, beef, pork, etc'
    },
    {
        name: 'vegetable',
        description: 'it is either cabbage, spinach, etc'
    },
    {
        name: 'drink',
        description: 'it is either juice, water, etc'
    }
];

async function reset() {
    const deletedFoodsCount = await prisma.food.deleteMany({});
    console.log(`Deleted ${deletedFoodsCount.count} foods.`);

    const deleteFoodStatusesCount = await prisma.foodStatus.deleteMany({});
    console.log(`Deleted ${deleteFoodStatusesCount.count} food statuses.`);

    const deletedOrdersCount = await prisma.order.deleteMany({});
    console.log(`Deleted ${deletedOrdersCount.count} orders.`);

    const deletedOrderItemsCount = await prisma.orderItem.deleteMany({});
    console.log(`Deleted ${deletedOrderItemsCount.count} order items.`);

    const deletedCategoriesCount = await prisma.category.deleteMany({});
    console.log(`Deleted ${deletedCategoriesCount.count} categories.`);

    const deleteOrderStatusesCount = await prisma.orderStatus.deleteMany({});
    console.log(`Deleted ${deleteOrderStatusesCount.count} order statuses.`);
}

async function main() {
    // empty foods, orders, orderItems, categories, orderStatuses

    await reset();

    for (let idx = 0; idx < categories.length; idx++) {
        const category = await prisma.category.create({
            data: categories[idx]
        });
        console.log(category);
    }

    for (let idx = 0; idx < orderStatuses.length; idx++) {
        const orderStatus = await prisma.orderStatus.create({
            data: orderStatuses[idx]
        });
        console.log(orderStatus);
    }

    for (let idx = 0; idx < foodStatuses.length; idx++) {
        const foodStatus = await prisma.foodStatus.create({
            data: foodStatuses[idx]
        });
        console.log(foodStatus);
    }
}
try {
    await main();
} catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        console.log(e.code, e.message, e.stack);
    }
    // console.log(e);
    throw e;
    console.log('did we catch an err, f3');
}
