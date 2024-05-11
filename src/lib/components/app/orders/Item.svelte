<script lang="ts">
	import type { OrderItemDetail } from '$lib/db';

	export let item: OrderItemDetail;
</script>

<tr class="">
	<td class="w-2/4">{item.food.name}</td>
	<td class="w-1/8"
		>{@html item.quantity > 1 ? ` x ${item.quantity}` : 'x 1'}</td>
	<td class="w-1/8">{item.cost > 0 ? ` ${item.cost}` : ''}</td>
	<td class="w-1/4">{item.cost > 0 ? `${item.cost * item.quantity}` : ''}</td>
</tr>
