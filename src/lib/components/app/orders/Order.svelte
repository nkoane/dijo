<script lang="ts">
	import type { OrderDetail } from '$lib/db';
	import { get } from 'svelte/store';
	import Item from './Item.svelte';
	import { onDestroy, onMount } from 'svelte';

	export let order: OrderDetail;
	const getFormOrderAction = (state: string): { action: string; label: string }[] => {
		switch (state) {
			case 'placed':
				return [
					{ action: '?/pay', label: 'Pay' },
					{ action: '?/cancel', label: 'Cancel' }
				];
			case 'paid':
				return [
					{ action: '?/prepare', label: 'Prepare' },
					{ action: '?/refund', label: 'Refund' }
				];
			case 'preparing':
				return [{ action: '?/ready', label: 'Ready' }];
			case 'ready':
				return [
					{ action: '?/collect', label: 'Collect' },
					{ action: '?/deliver', label: 'Deliver' }
				];
			case 'collected':
			case 'delivered':
				return [{ action: '?/complete', label: 'Complete' }];
			default:
				return [];
		}
	};

	const getTimeDifference = (): string => {
		const diff: number = new Date().getTime() - new Date(order.updatedAt).getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		let words = '';
		if (days > 0) {
			words = `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
		} else if (hours > 0) {
			words = `${hours}h ${minutes % 60}m ${seconds % 60}s`;
		} else if (minutes > 0) {
			words = `${minutes}m ${seconds % 60}s`;
		} else {
			words = `${seconds}s`;
		}

		return words;
	};

	let durationCounter = getTimeDifference();
	let timerInterval: number | undefined = undefined;

	onDestroy(() => {
		clearInterval(timerInterval);
	});

	onMount(() => {
		if (['placed', 'paid', 'preparing', 'ready'].find((state) => state === order.status.state)) {
			timerInterval = setInterval(() => {
				durationCounter = getTimeDifference();
			}, 1000) as unknown as number;
		}
		return () => {
			clearInterval(timerInterval);
		};
	});
</script>

<tr id="item-index-{order.id}">
	<td>
		<p>{String(order.id).padStart(4, '0')}</p>
		<!-- <p>{order.createdAt}</p> -->
		<p class="py1 my-2 font-bold">
			{durationCounter}
		</p>
		<!-- <p>{order.updatedAt}</p> -->
	</td>
	<td class="">
		<table class="w-full">
			<tbody>
				{#each order.items as item (item.id)}
					<Item {item} />
				{/each}
			</tbody>
		</table>
	</td>
	<td>R{order.cost}</td>
	<td class="">
		{#if getFormOrderAction(order.status.state).length > 0}
			<form method="post" class="flex h-full justify-between">
				<input type="hidden" name="orderId" value={order.id} />
				{#each getFormOrderAction(order.status.state) as option, optionIndex}
					<button
						id="order-action-{order.id}-{optionIndex}"
						formaction="{option.action}#order-{order.status.state}"
						class="h-full"
						type="submit"
						>{option.label}
					</button>
				{/each}
			</form>
		{/if}
	</td>
</tr>
