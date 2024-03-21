<script lang="ts">
	import '../app.pcss';
	import { Flame, FlameKindling, Soup } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { createAvatar, type Result } from '@dicebear/core';
	import { lorelei } from '@dicebear/collection';
	import socket from '$lib/stores/socket.js';

	const user = $page.data.user;

	const avatar = createAvatar(lorelei, {
		seed: user ? user.username : 'stranger'
		// ... other options
	}).toDataUriSync();
</script>

<svelte:head>
	<title>dijo</title>
</svelte:head>
<Toaster />
<main class="mx-auto mt-8 w-10/12">
	<header class="mb-4 flex items-center justify-between gap-2 bg-gray-50 p-4">
		<a
			id="logo"
			href="/"
			class="flex items-center gap-2 transition-colors duration-500 hover:text-yellow-500">
			<Soup class=" h-8 w-8 text-orange-500" />
			<h1 class="text-6xl font-bold">dijo</h1>
		</a>
		<nav>
			<ul class="flex items-center gap-4 uppercase">
				{#if user}
					{#if user.roleId < 5}
						<li><a href="/kitchen">Kitchen</a></li>
						{#if user.roleId < 4}
							<li><a href="/menu">Menu</a></li>
							<li><a href="/orders">Orders</a></li>
							{#if user.roleId === 1}
								<li><a href="/admin">Admin</a></li>
							{/if}
						{/if}
					{/if}
					<li>
						<form action="/logout" method="post">
							<Button type="submit" class="uppercase">Logout</Button>
						</form>
					</li>
					<li>
						<a href="/profile">
							<Avatar.Root>
								<Avatar.Image src={avatar} alt="@shadcn" />
								<Avatar.Fallback>{user.username}</Avatar.Fallback>
							</Avatar.Root>
						</a>
					</li>
				{:else}
					<li><a href="/register">Register</a></li>
					<li><a href="/login">Login</a></li>
				{/if}
			</ul>
		</nav>
	</header>
	<slot />
</main>
