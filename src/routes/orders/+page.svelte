<script lang="ts">
	import type { Order } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { socketStore } from '$lib/store.js';
	import { PanelBottomClose, PanelBottomOpen, PanelTopClose, PanelTopOpen } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let orders = data.orders ?? [];

	let sortedOrders: {
		[key: string]: Order[];
	} = {};

	const sortOrders = () => {
		// sort orders by statusId, then by updatedAt
		orders.sort((a, b) => {
			if (a.statusId! < b.statusId!) return -1;
			if (a.statusId! > b.statusId!) return 1;
			if (a.updatedAt < b.updatedAt) return 1;
			if (a.updatedAt > b.updatedAt) return -1;
			return 0;
		});

		sortedOrders = {};
		orders.forEach((order) => {
			const key = order.Status?.state ?? 'pending';
			if (sortedOrders[key] == undefined) {
				sortedOrders[key] = [];
			}

			sortedOrders[key].push(order);
		});
	};

	const orderDurations: {
		[key: number]:
			| {
					days: number;
					hours: number;
					minutes: number;
					seconds: number;
					toString: () => string;
			  }
			| undefined;
	}[] = [];
	const orderIntervals: number[] = [];

	onDestroy(() => {
		console.log('kitchen:page -> destroying this');
		orderIntervals.forEach((interval) => {
			clearInterval(interval);
		});
	});

	$: if (orders.length > 0) {
		orders = orders;
		orders.forEach((order) => {
			orderIntervals[order.id] = setInterval(
				() => {
					orderDurations[order.id] = duration(order.updatedAt);
				},
				1000 // * Math.max(1, index)
			);
		});

		sortOrders();
	}

	const duration = (
		createdAt: Date
	): {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		toString: () => string;
	} => {
		const now = new Date();
		const created = new Date(createdAt);
		const diff = now.getTime() - created.getTime();

		// get days
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const daysRemainder = diff % (1000 * 60 * 60 * 24);

		// get hours
		const hours = Math.floor(daysRemainder / (1000 * 60 * 60));
		const hoursRemainder = daysRemainder % (1000 * 60 * 60);

		// get minutes
		const minutes = Math.floor(hoursRemainder / (1000 * 60));
		const minutesRemainder = hoursRemainder % (1000 * 60);

		// get seconds
		const seconds = Math.floor(minutesRemainder / 1000);

		return {
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			toString: () => {
				return formatDuration(days, hours, minutes, seconds);
			}
		};
	};

	const formatDuration = (
		days: number,
		hours: number,
		minutes: number,
		seconds: number
	): string => {
		let duration = '';

		// pad all results with 0

		if (seconds > 0) {
			duration += `${seconds.toString().padStart(2, '0')}s `;
		}
		if (minutes > 0) {
			duration += `${minutes.toString().padStart(2, '0')}m<br/>`;
		}
		if (hours > 0) {
			duration += `${hours.toString().padStart(2, '0')}h`;
		}
		if (days > 0) {
			duration += `${days.toString().padStart(2, '0')}d`;
		}

		return duration;
	};

	$socketStore.on('order', (order) => {
		console.log('kitchen:page -> order -> recieved: ', order.id);

		toast.success(`Order ${order.id} received.`);
		orders.push(order);
		sortOrders();
	});

	onMount(() => {
		const stateGroups = document.querySelectorAll('.state');

		stateGroups.forEach((state) => {
			const stateOrders = state.querySelector('.state > .state-orders');
			const stateToggle = state.querySelector('.state .state-toggle');

			if (stateOrders && stateToggle) {
				stateToggle.addEventListener('click', () => {
					stateOrders?.classList.toggle('hidden');

					stateToggle.querySelector('.toggle-open')?.classList.toggle('hidden');
					stateToggle.querySelector('.toggle-close')?.classList.toggle('hidden');
				});
			}
		});
	});

	$: if (form?.success === true) {
		console.log('kitchen:page -> orders:form ', form.order?.id, form.status, form.order);
		// find the order by id in the orders array
		if (form?.order && form.status) {
			const order = orders.find((order) => order.id === form?.order?.id);
			if (order) {
				order.statusId = form.order?.statusId;
				order.updatedAt = form.order?.updatedAt;
				order.Status = form.status;
				sortOrders();
			}
		}
	}
</script>

<h2 class="text-2xl font-bold mb-4">The Kitchen: {orders.length}</h2>
{#each Object.keys(sortedOrders) as state, stateIndex}
	<div class="bg-blue-50 mb-2 p-2 state">
		<div class="bg-white p-2 text-black font-bold text-sm uppercase flex gap-2">
			<h4 class="flex-grow">{state}</h4>
			<span>{sortedOrders[state].length.toString().padStart(2, '0')}</span>
			<button class="state-toggle hover:opacity-60">
				<PanelBottomOpen class="toggle-open {state != 'placed' ? 'hidden' : ''} w-6 h-6" />
				<PanelBottomClose class="toggle-close {state != 'placed' ? '' : 'hidden'} w-6 h-6" />
			</button>
		</div>
		<ol class="{state != 'placed' ? 'hidden' : ''} state-orders">
			{#each sortedOrders[state] as order, orderIndex}
				<li class="bg-gray-100 mb-2 flex gap-2 p-2 justify-between">
					<h3 class="font-bold">{order.id}</h3>
					<ul class="food-items bg-blue-200 flex-grow">
						{#each order.OrderItems as item}
							<li class="food-item">
								<span>{item.quantity} x</span>
								<span>{item.food.name}</span>
								<!-- <span>R{item.cost}</span> -->
							</li>
						{/each}
					</ul>
					<p class="w-2/12 bg-blue-200 text-sm">{@html orderDurations[order.id] ?? '&empty;'}</p>
					<form
						method="post"
						class="w-3/12 justify-between flex flex-row-reverse gap-2 text-xs"
						use:enhance>
						<input type="hidden" name="id" value={order.id} />
						{#if order.Status?.state == 'placed'}
							<button
								type="submit"
								formaction="?/cancel"
								class="bg-red-600 p-2 block self-start rounded text-white font-bold">
								CANCEL
							</button>
							<button
								type="submit"
								formaction="?/prepare"
								class="bg-blue-600 text-white font-bold p-2 block self-start rounded"
								>PREPARE</button>
						{/if}

						{#if order.Status?.state == 'preparing'}
							<button
								type="submit"
								formaction="?/ready"
								class="bg-blue-600 p-2 block self-start rounded text-white font-bold">READY</button>
						{/if}
						{#if order.Status?.state == 'ready'}
							<button
								type="submit"
								formaction="?/collected"
								class="bg-blue-600 p-2 block self-start rounded text-white font-bold"
								>COLLECTED</button>
							<button
								type="submit"
								formaction="?/delivered"
								class="bg-blue-600 p-2 block self-start rounded text-white font-bold"
								>DELIVERED</button>
						{/if}
					</form>
				</li>
			{/each}
		</ol>
	</div>
{/each}
