<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { io } from 'socket.io-client';
	export let data;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	function placeOrder(ev: SubmitEvent) {
		const form = ev.target as unknown as HTMLFormElement;

		socket.emit('menu-order-place', {
			orderNumber: form.orderId.value,
			userId: data.user?.id,
			items: [
				{
					name: 'Burger',
					foodId: 1,
					quantity: Math.floor(Math.random() * 5),
					price: 5.99,
					comment: 'No pickles'
				},
				{
					name: 'Fries',
					foodId: 2,
					quantity: Math.min(1, Math.floor(Math.random() * 5)),
					price: 2.99,
					comment: 'Extra salt'
				}
			]
		});

		form.orderId.value = crypto.randomUUID();
	}

	const dijo = data?.dijo;
</script>

<h2>Menu</h2>

{#if !data.user}
	<form on:submit={placeOrder}>
		<input type="text" name="orderId" value={crypto.randomUUID()} />
		<Button type="submit">Place Order</Button>
	</form>
{/if}

{#if dijo}
	<main class="flex w-full flex-col gap-2 bg-yellow-50">
		{#each Object.keys(dijo) as category}
			<dl class="w-1/4 bg-gray-50 p-2">
				<dt><h3>{category}</h3></dt>
				{#each dijo[category] as food}
					<dd class="mb-4 flex flex-col bg-red-50 p-4 last:mb-0">
						<h4>{food.name}</h4>
						<p>{food.description}</p>
						<p>R{food.price}</p>
					</dd>
				{/each}
			</dl>
		{/each}
	</main>
{/if}
