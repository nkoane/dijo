# DIJO

**dijo**, _simply means **food**, in SeTswana_.

## Pre-emble

This was a classwork task I used to demonstrate how to build a web application to students, but after some serious amount of boredom, I figured I could make it an actual application that people could use to manage their chisa-nyama (pop-up shop as Americans call it).

## What is it?

dijo an application that allows the street venders to manage the process of selling their goods: invetory (pricing, quantity and pricing on a day to day basis). This also involes handling the exchange of money.

The key part is (if it is a chisa-nyama or a food stall) that it will inform the kitchen in real time as orders are placed; and the kitchen can prepare the food and mark it as ready for collection and/or delivery.

## How to run the application

This is still work in progress, so bare with me until a working prototype is ready.

### Prerequisites

Install all relevant packages using pnpm:

```bash
pnpm install
```

Copy the `.env.example` file to `.env` and fill in the necessary details for `DATABASE_URL` and `PUBLIC_SOCKET_IO_ENDPOINT` and run primsa initailisation, migration and seeding (root password will be printed ont he console).

```bash
cp .env.example .env
```

And run primsa initailisation, migration and seeding (root password will be printed ont he console).

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### For development

Run the following to start the application (in development mode):

```bash
pnpm dev
```

### For production

Run the following command to build the application:

```bash
pnpm build
```

After building the application, you can start the application using the following command (this is because socket-io and svelte-kit do not play well together, so we need to start the server separately)

```bash
node server/index.js
```

### How to use the application

After starting the application, you can access the application at `http://localhost:5173` (or whatever you have set it to be). You will be prompted to login, use the following credentials:

```code
username: root
password: dijo-tse-monate
```

Afterwhich, you can access the dashboard, to add food categories, the food themselves. For now, the assumption is that all foods fall into the following categories:

- General
- Starch
- Meat
- Vegetables
- Beverages

## Questions?

I do not know why you'd need to ask questions, but shoot your shot.

el oh el.
