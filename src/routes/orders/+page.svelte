<script lang="ts">
	import type { PageData } from './$types';
	import { fromISOtoDatetime, formatDate } from '$lib/utilities';
    import Pagination from '$lib/components/elements/Pagination.svelte';
    
	export let data: PageData;
	$: ({ id, email, first_name, last_name, phone, billing_address_id, shipping_addresses, orders } =
		data.user);
	$: orders.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
	$: currentPage = data?.currentPage || 1;
	let opp = 10; // orders per page

	$: console.log(orders)

	function toDatetime(date: string): string {
		const split = date.split('T')
		return split[0]
	}
</script>

<div class="max-w-screen-2xl dark:bg-gray-900 mx-auto py-6 px-6 md:px-8 sm:px-6">
	<div class="max-w-5xl mx-auto mb-12 text-center">
		<h1
			class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight text-center"
		>
			Order History
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

<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
    <div class="max-w-xl">
      <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
      <p class="mt-1 text-sm text-gray-500">Check the status of recent orders, manage returns, and download invoices.</p>
    </div>

    <section aria-labelledby="recent-heading" class="mt-16">
      <h2 id="recent-heading" class="sr-only">Recent orders</h2>

      <div class="space-y-20">
		{#if orders?.length}
			{#each orders as order, i}
				{#if i >= currentPage * opp - opp && i < currentPage * opp}
<div>
          <h3 class="sr-only">Order placed on <time datetime={fromISOtoDatetime(order.created_at)}>{formatDate(order.created_at)}</time></h3>

          <div class="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
            <dl class="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
              <div class="flex justify-between sm:block">
                <dt class="font-medium text-gray-900">Date placed</dt>
                <dd class="sm:mt-1">
                  <time datetime={fromISOtoDatetime(order.created_at)}>{formatDate(order.created_at)}</time>
                </dd>
              </div>
              <div class="flex justify-between pt-6 sm:block sm:pt-0">
                <dt class="font-medium text-gray-900">Order number</dt>
                <dd class="sm:mt-1">{order.display_id}</dd>
              </div>
              <div class="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                <dt>Total amount</dt>
                <dd class="sm:mt-1">$104.00</dd>
              </div>
            </dl>
            <a href="#" class="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto">
              View Invoice
              <span class="sr-only">for order WU88191111</span>
            </a>
          </div>

          <table class="mt-4 w-full text-gray-500 sm:mt-6">
            <caption class="sr-only">
              Products
            </caption>
            <thead class="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
              <tr>
                <th scope="col" class="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">Product</th>
                <th scope="col" class="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Price</th>
                <th scope="col" class="hidden py-3 pr-8 font-normal sm:table-cell">Status</th>
                <th scope="col" class="w-0 py-3 text-right font-normal">Info</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
              <tr>
                <td class="py-6 pr-8">
                  <div class="flex items-center">
                    <img src="https://tailwindui.com/img/ecommerce-images/order-history-page-04-product-01.jpg" alt="Black tee with intersecting red, white, and green curved lines on front." class="mr-6 h-16 w-16 rounded object-cover object-center">
                    <div>
                      <div class="font-medium text-gray-900">Men&#039;s 3D Glasses Artwork Tee</div>
                      <div class="mt-1 sm:hidden">$36.00</div>
                    </div>
                  </div>
                </td>
                <td class="hidden py-6 pr-8 sm:table-cell">$36.00</td>
                <td class="hidden py-6 pr-8 sm:table-cell">Delivered Jan 25, 2021</td>
                <td class="whitespace-nowrap py-6 text-right font-medium">
                  <a href="#" class="text-indigo-600">View<span class="hidden lg:inline"> Product</span><span class="sr-only">, Men&#039;s 3D Glasses Artwork Tee</span></a>
                </td>
              </tr>

              <!-- More products... -->
            </tbody>
          </table>
        </div>
				{/if}
			{/each}
			<Pagination bind:currentPage itemCount={orders.length} itemsPerPage={opp} />
		{:else}
        	<div class="my-3">No orders yet</div>
		{/if}

        <!-- More orders... -->
      </div>
    </section>
  </main>
