<script lang="ts">
	import type { PageData } from './$types';
	import Order from './(components)/order.svelte';
	import Pagination from '$lib/components/elements/Pagination.svelte';

	export let data: PageData;
	let { orders } = data.user;
	$: sorted = orders.sort(
		(a, b) => Date.parse(b.created_at.toString()) - Date.parse(a.created_at.toString())
	);
	$: currentPage = data?.currentPage || 1;
	let opp = 10; // orders per page
</script>

<div class="max-w-xl">
	<h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Order history</h1>
	<p class="mt-1 text-sm text-muted-foreground">
		Check the status of recent orders, manage returns, and download invoices.
	</p>
</div>

<section aria-labelledby="recent-heading" class="mt-16">
	<h2 id="recent-heading" class="sr-only">Recent orders</h2>

	<div class="space-y-20">
		{#if sorted?.length}
			{#each sorted as order, i}
				{#if i >= currentPage * opp - opp && i < currentPage * opp}
					<Order data={order} />
				{/if}
			{/each}
			<Pagination bind:currentPage itemCount={orders.length} itemsPerPage={opp} />
		{:else}
			<div class="my-3">No orders yet</div>
		{/if}
	</div>
</section>
