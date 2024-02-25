<main>
	<div class="flex items-center justify-between pb-4">
		<h2>dash</h2>
		<nav>
			<a href="/admin/people">people</a>
			<a href="/admin/food">food</a>
			<a href="/admin/categories">categories</a>
		</nav>
	</div>
	<section>
		<slot />
	</section>
</main>

<style lang="postcss">
	main div {
		@apply mb-4 flex items-center justify-between border-b pb-2;
	}
</style>
