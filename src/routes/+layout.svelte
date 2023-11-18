<script lang="ts">
	import '../app.postcss';
	import { FlameKindling } from 'lucide-svelte';
	import { Toaster } from 'svelte-french-toast';
	import { createAvatar } from '@dicebear/core';
	import { avataaars } from '@dicebear/collection';
	import { io } from 'socket.io-client';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';

	const avatar = createAvatar(avataaars, {
		seed: 'Tommy Spinelli'
		// ... other options
	});
	const svg = avatar.toString();

	onMount(() => {
		const socket = io();

		socket.on('order', (order) => {
			console.log('root:page -> order: ', order.id);
			toast.success(`Order ${order.id} received.`);
		});
	});
</script>

<!-- 
<svelte:head>
    <title>DIJO</title>
</svelte:head> 
-->
<Toaster />
<main class="mx-auto mt-8 w-10/12 rounded-md bg-gray-50 p-6">
	<header class="flex items-center gap-2 border-b-2 border-blue-100 pb-4 mb-6">
		<FlameKindling class="h-8 w-8 text-orange-600" />
		<h1
			class="my-2 text-4xl font-bold text-orange-600 hover:text-red-600 transition-colors duration-100">
			<a href="/">dijo</a>
		</h1>
		<nav class="ml-auto flex text-right font-bold text-gray-400 gap-2">
			<a href="/">root</a>
			<a href="/orders">kitchen</a>
			<a href="/food">food</a>
			<a href="/account" class=" w-[2rem]">{@html svg}</a>
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
