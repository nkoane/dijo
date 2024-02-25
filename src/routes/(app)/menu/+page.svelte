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
</script>

<h2>Menu, {data.user?.username}: {data.user?.roleId}.</h2>
<form on:submit|preventDefault={placeOrder} method="post">
	<input
		type="text"
		placeholder="Enter order number"
		name="order-id"
		id="orderId"
		value={crypto.randomUUID()} />
	<Button type="submit" class="font-bold uppercase">Place Order</Button>
</form>

<style lang="postcss">
	h2 {
		@apply mb-4 text-xl;
	}

	form {
		@apply flex gap-2;
	}

	input {
		@apply flex-grow rounded-md border-2 border-gray-300 p-2;
	}

	button {
		@apply rounded-md bg-blue-500 p-2 text-white;
	}
</style>
