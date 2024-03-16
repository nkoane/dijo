<script lang="ts">
	import { io } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';

	import {
		Wheat,
		Beef,
		LeafyGreen,
		GlassWater,
		SquareArrowRight,
		SquarePlus,
		SquareMinus,
		Trash
	} from 'lucide-svelte';

	export let data;
	export let form;

	const { menu } = data;

	const socket = io();

	socket.on('testMessage', (message) => {
		console.log('testMessage', message);
	});

	type Icon = {
		[category: string]: typeof Wheat | typeof Beef | typeof LeafyGreen | typeof GlassWater;
	};

	const categoryIcons: Icon = {
		Starch: Wheat,
		Meat: Beef,
		Vegetables: LeafyGreen,
		Drinks: GlassWater
	};

	$: if (form?.order) {
		console.log('(app)/menu: form->order', form.order);
		socket.emit('menu-order-placed', form.order);
	}

	$: console.log('(menu/page.svelte) -> menu', menu);
</script>

<h2>Menu</h2>
