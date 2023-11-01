<script lang="ts">
    import '../app.postcss';
    import { Code } from 'lucide-svelte';
</script>

<svelte:head>
    <title>S:KIT</title>
</svelte:head>
<main class="mx-auto mt-8 w-10/12 rounded-md bg-gray-50 p-6">
    <header class="mb-4 flex items-center gap-2">
        <Code class="h-8 w-8 text-red-600" />
        <h1 class="my-2 text-4xl font-bold"><a href="/">S:KIT</a></h1>
        <nav class="ml-auto flex text-right font-bold text-gray-400">
            <a href="/">ROOT</a>
            <a href="#top">TREE</a>
            <a href="#bottom">FUNK</a>
        </nav>
    </header>
    <slot />
</main>

<style lang="postcss">
    nav a {
        @apply inline-block border-l-2 border-gray-200 p-0 px-8 transition-all duration-100 ease-in-out last:border-r-2 hover:border-l-red-400 hover:bg-yellow-200 hover:text-gray-600;
    }
</style>
