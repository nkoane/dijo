<script lang="ts">
    export let data, form;
    const foods = data.foods;
</script>

<h3 class="font-bold text-2xl">Food</h3>
<main class="xs:flex gap-2">
    {#if foods.length > 0}
        <ol class=" list-decimal ml-4">
            {#each foods as food (food.id)}
                <li>
                    <a href="/food/{food.id}">{food.name}</a>
                    <span>R{food.cost}</span>
                    <a href="/food?category={food.categoryId}">{food.category.name}</a>
                </li>
            {/each}
        </ol>
    {:else}
        <p><em>no food</em></p>
    {/if}
    <form class="bg-gray-50 flex-grow flex gap-2 flex-col" method="post">
        <div class="flex gap-2 justify-between">
            <label class="flex-grow flex flex-col gap-1">
                <input
                    type="text"
                    class="mt-1 block w-full"
                    placeholder="Name"
                    name="name"
                    value={form?.name ?? ''} />
                {#if form?.errors?.fieldErrors.name}
                    <span class="text-red-600 text-xs">{form?.errors?.fieldErrors.name}</span>
                {/if}
            </label>
            <label class="flex-grow flex flex-col gap-1">
                <input
                    type="text"
                    class="mt-1 block w-full"
                    placeholder="Price"
                    min="0"
                    name="cost"
                    value={form?.cost ?? ''} />
                {#if form?.errors?.fieldErrors.cost}
                    <span class="text-red-600 text-xs">{form?.errors?.fieldErrors.cost}</span>
                {/if}
            </label>
        </div>
        <label class="block">
            <textarea
                class="mt-1 block w-full"
                placeholder="Description"
                name="description"
                value={form?.description ?? ''}></textarea>
        </label>
        <label class="flex-grow flex flex-col gap-1">
            <select class="mt-1 block w-full" name="categoryId">
                {#each data.categories as category, idx}
                    <option
                        value={category.id}
                        class="capitalize"
                        selected={category.id === form?.categoryId ? true : null}>
                        {category.name}
                    </option>
                {/each}
            </select>
            {#if form?.errors?.fieldErrors.categoryId}
                <span class="text-red-600 text-xs">{form?.errors?.fieldErrors.categoryId}</span>
            {/if}
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
