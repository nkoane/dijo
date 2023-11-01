import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const orderStatuses = [
    {
        state: 'Pending',
        description: 'Order has been placed but not paid for'
    },
    {
        state: 'Paid',
        description: 'Order has been paid for'
    },
    {
        state: 'Preparing',
        description: 'Order is being prepared'
    },
    {
        state: 'Ready',
        description: 'Order is ready for collection'
    },
    {
        state: 'Delivered',
        description: 'Order has been delivered'
    },
    {
        state: 'Collected',
        description: 'Order has been collected'
    },
    {
        state: 'Canceled',
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

async function main() {
    const deletedCategoriesCount = await prisma.category.deleteMany({});
    console.log(`Deleted ${deletedCategoriesCount.count} categories.`);
    for (let idx = 0; idx < categories.length; idx++) {
        const category = await prisma.category.create({
            data: categories[idx]
        });
        console.log(category);
    }

    const deleteOrderStatusesCount = await prisma.orderStatus.deleteMany({});
    console.log(`Deleted ${deleteOrderStatusesCount.count} order statuses.`);
    for (let idx = 0; idx < orderStatuses.length; idx++) {
        const orderStatus = await prisma.orderStatus.create({
            data: orderStatuses[idx]
        });
        console.log(orderStatus);
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
