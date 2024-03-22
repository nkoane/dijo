<script lang="ts">
	import type { OrderDetail, Orders } from '$lib/db/index.js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import socket from '$lib/stores/socket.js';
	import OrdersTable from '$lib/components/app/orders/Orders.svelte';

	export let data;
	let orders: Orders = data?.orders || {};

	onMount(() => {
		const anchors = document.querySelectorAll('nav#kitchen-nav a');

		anchors.forEach((anchor, index) => {
			if (location.hash == (anchor as HTMLAnchorElement).hash) {
				anchors.forEach((a, i) => a.classList.remove('selected'));
				anchor.classList.add('selected');
			}

			anchor.addEventListener('click', (ev) => {
				const target = ev.target as HTMLAnchorElement;
				anchors.forEach((a, i) => a.classList.remove('selected'));
				target.classList.add('selected');
			});
		});

		$socket.on('kitchen-order-new', (data) => {
			if (data.order) {
				const order = data.order as OrderDetail;
				const msg = `new order (${order.id}-${order.status.state}) from (${$socket.id}) with ${order.items.length} items`;
				toast.success(msg);
				// orders = [...orders, order];
				if (orders[order.status.state] == undefined) {
					orders[order.status.state] = [];
				}
				orders[order.status.state] = [...orders[order.status.state], order];
			}
		});

		return () => {};
	});
</script>

<h2>Kitchen, {data.user?.username}: {data.user?.roleId}.</h2>

<h3 class="my-3">Orders: {data?.total}</h3>
{#if Object.keys(orders).length === 0}
	<p>No orders.</p>
{:else}
	<nav id="kitchen-nav" class="flex w-full gap-2 bg-gray-50">
		{#each Object.keys(orders) as orderStatus, orderIndex (orderStatus)}
			<a
				class="block bg-white px-2 py-1 font-bold text-gray-300 {orderIndex == 0
					? 'selected'
					: `select-none-${orderIndex}`}"
				href="#order-{orderStatus}">
				{orderStatus}: {orders[orderStatus].length}
			</a>
		{/each}
	</nav>
	<section class=" bg-yellow-50 p-2 py-1 text-sm">
		{#each Object.keys(orders) as orderGroupStatus (orderGroupStatus)}
			<div id="order-{orderGroupStatus}" class="block text-sm">
				<OrdersTable {orderGroupStatus} {orders} />
			</div>
		{/each}
	</section>
{/if}

<style lang="postcss">
	nav a.selected {
		color: #000;
		background-color: rgb(254, 253, 232);
	}

	section div {
		@apply hidden;
	}
	section div:first-child {
		@apply block;
	}

	section div:target {
		display: block;
	}

	section:has(div:target) div {
		display: none;
	}

	section:has(div:target) div:target {
		display: block;
	}
</style>
