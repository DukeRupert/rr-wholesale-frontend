<script lang="ts">
	import type { OrderSummary } from '$lib/types/order';
	import { formatPrice } from '$lib/utilities';
    import { company } from '$lib/constants';

	export let data: OrderSummary;
</script>

<main class="lg:flex lg:min-h-full lg:flex-row-reverse">
	<section class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
		<div class="mx-auto max-w-3xl">
			<div class="max-w-xl">
                <div class="pb-4 lg:flex">
					<span class="sr-only">{company.name}</span>
					<a href="/"><img src={company.logo.src} alt={company.logo.alt} class="h-24 w-auto" /></a>
				</div>
				<h1 class="text-base font-medium text-thunderbird-500">Thank you!</h1>
				<p class="mt-2 text-4xl font-bold tracking-tight">It's on the way!</p>
				<p class="mt-2 text-base text-gray-500">
					Your order #{data.display_id} has been recieved and will be with you soon.
				</p>

				<!-- Tracking Information -->
				<!-- <dl class="mt-12 text-sm font-medium">
                        <dt class="text-gray-900">Tracking number</dt>
                        <dd class="mt-2 text-thunderbird-600">51547878755545848512</dd>
                    </dl> -->
			</div>

			<section aria-labelledby="order-heading" class="mt-10 border-t border-gray-200">
				<h2 id="order-heading" class="sr-only">Your order</h2>

				<h3 class="sr-only">Items</h3>
				{#each data.items as item, i}
					<div class="flex space-x-6 border-b border-gray-200 py-10">
						<img
							src={item.thumbnail}
							alt={item.title}
							class="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
						/>
						<div class="flex flex-auto flex-col">
							<div>
								<h4 class="font-medium text-gray-900">
									{item.title}
								</h4>
								<p class="mt-2 text-sm text-gray-600">{item.description}</p>
							</div>
							<div class="mt-6 flex flex-1 items-end">
								<dl class="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
									<div class="flex">
										<dt class="font-medium text-gray-900">Quantity</dt>
										<dd class="ml-2 text-gray-700">{item.quantity}</dd>
									</div>
									<div class="flex pl-4 sm:pl-6">
										<dt class="font-medium text-gray-900">Price</dt>
										<dd class="ml-2 text-gray-700">{formatPrice(item.unit_price)}</dd>
									</div>
								</dl>
							</div>
						</div>
					</div>
				{/each}

				<div class="sm:pl-6">
					<h3 class="sr-only">Your information</h3>

					<h4 class="sr-only">Addresses</h4>
					<dl class="grid grid-cols-2 gap-x-6 py-10 text-sm">
						<div>
							<dt class="font-medium text-gray-900">Shipping address</dt>
							<dd class="mt-2 text-gray-700">
								<address class="not-italic">
									<span class="block">{data.shipping_address.first_name} {data.shipping_address.last_name}</span>
									<span class="block">{data.shipping_address.address_1}</span>
									<span class="block">{data.shipping_address.city}, {data.shipping_address.province} {data.shipping_address.postal_code}</span>
								</address>
							</dd>
						</div>
						
					</dl>

					<h3 class="sr-only">Summary</h3>

					<dl class="space-y-6 border-t border-gray-200 pt-10 text-sm">
						<div class="flex justify-between">
							<dt class="font-medium text-gray-900">Subtotal</dt>
							<dd class="text-gray-700">{formatPrice(data.subtotal)}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium text-gray-900">Shipping</dt>
							<dd class="text-gray-700">{formatPrice(data.shipping_total)}</dd>
						</div>
						<div class="flex justify-between">
							<dt class="font-medium text-gray-900">Total</dt>
							<dd class="text-gray-900">{formatPrice(data.total)}</dd>
						</div>
					</dl>
				<div class="mt-10 text-center">
                <a href="/" class="btn">&larr; Return home</a>
            </div></div>
			</section>
            
		</div>
	</section>
</main>