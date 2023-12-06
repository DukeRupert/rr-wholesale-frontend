<script lang="ts">
	import type { PageData } from './$types';
    import Pagination from '$lib/components/elements/Pagination.svelte';
    
	export let data: PageData;
	$: ({ id, email, first_name, last_name, phone, billing_address_id, shipping_addresses, orders } =
		data.user);
	$: orders.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
	$: currentPage = data?.currentPage || 1;
	let opp = 10; // orders per page
</script>

<div class="max-w-screen-2xl dark:bg-gray-900 mx-auto py-6 px-6 md:px-8 sm:px-6">
	<div class="max-w-5xl mx-auto mb-12 text-center">
		<h1
			class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center"
		>
			Orders
		</h1>
	</div>

	<div class="max-w-screen-lg mx-auto">
		<div
			class="border-b border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6 mt-8 sm:mt-12 lg:mt-20"
		>
			<div class="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
				<div class="ml-4 mt-2">
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">Orders</h3>
				</div>
			</div>
		</div>
		{#if orders?.length}
			{#each orders as order, i}
				{#if i >= currentPage * opp - opp && i < currentPage * opp}
					<div class="sm:flex sm:flex-wrap my-3 justify-between dark:text-gray-200">
						<div class="mr-2 block sm:inline">
							{new Date(order.created_at).toLocaleDateString('us-EN', {
								month: 'long',
								day: 'numeric',
								year: 'numeric'
							})}
						</div>
						<div class="mr-2 block sm:inline">
							Order Num: {order.display_id}
						</div>
						<div class="mr-2 block sm:inline">
							{order.fulfillment_status === 'fulfilled' ? 'Shipped' : 'Pending'}
						</div>
						<div>
							<a
								href={`/account/order/${order.id}`}
								class="text-thunderbird-600 hover:text-thunderbird-500 mr-3">View / Track</a
							>
						</div>
					</div>
				{/if}
			{/each}
			<Pagination bind:currentPage itemCount={orders.length} itemsPerPage={opp} />
		{:else}
			<div class="my-3">No orders yet</div>
		{/if}
	</div>
</div>
