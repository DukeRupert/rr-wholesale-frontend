<script lang="ts">
	import type { PageData } from './$types';
	import Order from '$lib/components/Order.svelte'
	import Pagination from '$lib/components/elements/Pagination.svelte';

	export let data: PageData;
	$: ({ id, email, first_name, last_name, phone, billing_address_id, shipping_addresses, orders } =
		data.user);
	$: orders.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
	$: currentPage = data?.currentPage || 1;
	let opp = 10; // orders per page

	$: console.log(orders);
</script>


<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
	<div class="max-w-xl">
		<h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
		<p class="mt-1 text-sm text-gray-500">
			Check the status of recent orders, manage returns, and download invoices.
		</p>
	</div>

	<section aria-labelledby="recent-heading" class="mt-16">
		<h2 id="recent-heading" class="sr-only">Recent orders</h2>

		<div class="space-y-20">
			{#if orders?.length}
				{#each orders as order, i}
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
</div>
