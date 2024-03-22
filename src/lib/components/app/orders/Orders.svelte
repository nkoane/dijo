<script lang="ts">
	import type { Orders } from '$lib/db';
	import Order from './Order.svelte';
	export let orderGroupStatus: string;
	export let orders: Orders;
</script>

<table class="orders w-full border-collapse">
	<thead>
		<tr>
			<th class="w-1/8">#-{orderGroupStatus}</th>
			<th class="w-1/2">
				<table class="w-full">
					<thead>
						<tr>
							<th class="w-2/4">item</th>
							<th class="w-1/8">qty</th>
							<th class="w-1/8">cost</th>
							<th class="w-1/4">total</th>
						</tr>
					</thead>
				</table>
			</th>
			<th class="w-1/8">Cost</th>
			<th class="w-1/4">act</th>
		</tr>
	</thead>
	<tbody>
		{#each orders[orderGroupStatus] as order (order.id)}
			<Order {order} />
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<td colspan="3">Total</td>
			<td class="font-bold">
				R{orders[orderGroupStatus].reduce((acc, order) => acc + order.cost, 0)}
			</td>
		</tr>
	</tfoot>
</table>
