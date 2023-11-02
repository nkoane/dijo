<script lang="ts">
    import type { Food } from '@prisma/client';

    export let data, form;

    let selectedCategory: number;

    if (form?.categoryId) selectedCategory = Number(form?.categoryId);
</script>

<h3 class="font-bold text-2xl">Food</h3>
<main class="xs:flex gap-2">
    {#if data?.foods}
        <ol>
            <li>food name</li>
        </ol>
    {:else}
        <p><em>no food</em></p>
    {/if}
    <form class="bg-gray-50 flex-grow flex gap-2 flex-col" method="post">
        <div class="flex gap-2 justify-between">
            <label class="flex-grow">
                <input
                    type="text"
                    class="mt-1 block w-full"
                    placeholder="Name"
                    name="name"
                    value={form?.name ?? ''} />
            </label>
            <label class="">
                <input
                    type="text"
                    class="mt-1 block w-full"
                    placeholder="Price"
                    min="0"
                    name="cost"
                    value={form?.cost ?? ''} />
            </label>
        </div>
        <label class="block">
            <textarea
                class="mt-1 block w-full"
                placeholder="Description"
                name="description"
                value={form?.description ?? ''}></textarea>
        </label>
        <label class="">
            <select class="mt-1 block w-full" name="categoryId">
                {#each data.categories as category, idx}
                    <option
                        value={category.id}
                        class="capitalize"
                        selected={category.id === selectedCategory ? 'selected' : ''}>
                        {category.name} ? {category.id} ? {selectedCategory}
                    </option>
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
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4">
            Submit
        </button>
    </form>
</main>
