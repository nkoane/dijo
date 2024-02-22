# DIJO Starter Pack

Okay, this was a classwork task I used to demonstrate how to build a web application to students, but after some serious amount of boredom, I figured I could make it an actual application that people could use to manage their chisa-nyama (pop-up shop as Americans call it).

## What is it?

dijo an application that allows the owner of the chisa-nyama (pop-up shop) to place orders; and for the kitchen to see the orders coming in, and clear them as they are collected by customers.

That's it, that's the whole application. I will add more functionality as I time allows.

### How to run the application

This is still work in progress, I'll add this once I have a working protoype.

#### Prerequisites

Install all relevate packages using pnpm:

```bash
pnpm install
```

Run the following to seed the db with a roles, categories and an adminstrative user (their password will be randomly generated and printed to the console):

```bash
pnpx tsx prisma/seed.ts
```

Afterwhich, you can access the dashboard, to add food categories, the food themselves. For now, the assumption is that all foods fall into the following categories:

- Starch
- Meat
- Vegetables
- Drinks

## Questions?

I do not know why you'd need to ask questions, but shoot your shot.

el oh el.
