<script lang="ts">
    import type { Food } from '@prisma/client';

    export let data, form;

    console.log('form', form);
</script>

<h3 class="font-bold text-2xl">Food</h3>
<main class="flex gap-2">
    {#if data?.foods}
        <ol>
            <li>food name</li>
        </ol>
    {:else}
        <p><em>no food</em></p>
    {/if}
    <form class="bg-gray-50 flex-grow flex gap-2 flex-col" method="post">
        <label class="block">
            <span class="text-gray-700">Food name</span>
            <input
                type="text"
                class="mt-1 block w-full"
                placeholder="Food name"
                name="name"
                value={form?.name ?? ''} />
        </label>
        <label class="block">
            <span class="text-gray-700">Food cost</span>
            <input
                type="number"
                class="mt-1 block w-full"
                placeholder="Food cost"
                min="0"
                name="cost"
                value={form?.cost ?? 0} />
        </label>
        <label class="block">
            <span class="text-gray-700">Food description</span>
            <textarea
                class="mt-1 block w-full"
                placeholder="Food description"
                name="description"
                value={form?.description ?? ''}></textarea>
        </label>
        <label>
            <span class="text-gray-700">Food category</span>
            <select class="mt-1 block w-full" name="categoryId" value={form?.categoryId}>
                {#each data.categories as category}
                    <option value={category.id ?? data.categories[0].id} class="capitalize"
                        >{category.name}</option>
                {/each}
            </select>
        </label>
        <!-- <label class="block">
            <span class="text-gray-700">Food image</span>
            <input
                type="file"
                class="mt-1 block w-full"
                placeholder="Food image"
                bind:value={food?.image} />
        </label> -->
        <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >Submit</button>
    </form>
</main>
