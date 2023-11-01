<script lang="ts">
    import '../app.postcss';
    import { FlameKindling } from 'lucide-svelte';
</script>

<!-- 
<svelte:head>
    <title>DIJO</title>
</svelte:head> 
-->
<main class="mx-auto mt-8 w-10/12 rounded-md bg-gray-50 p-6">
    <header class="mb-4 flex items-center gap-2">
        <FlameKindling class="h-8 w-8 text-orange-600" />
        <h1
            class="my-2 text-4xl font-bold text-orange-600 hover:text-yellow-600 transition-colors duration-100">
            <a href="/">DIJO</a>
        </h1>
        <nav class="ml-auto flex text-right font-bold text-gray-400 gap-2">
            <a href="/kitchen">KÖK</a>
            <a href="/dash">DASHBOARD</a>
        </nav>
    </header>
    <slot />
</main>

<style lang="postcss">
    nav a {
        @apply inline-block  transition-all duration-100 ease-in-out hover:bg-yellow-200 hover:text-gray-600;
        @apply first:border-none;
    }
</style>
