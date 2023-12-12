<script lang="ts">
	import type { Cart } from "$lib/types/cart";
    import { formatPrice } from "$lib/utilities";

    export let data: Cart
    const { items, total, subtotal, tax_total, shipping_total } = data;
</script>

<section
	aria-labelledby="summary-heading"
	class="bg-black py-12 text-gray-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
>
	<div class="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
		<h2 id="summary-heading" class="sr-only">Order summary</h2>

		<dl>
			<dt class="text-sm font-medium">Amount due</dt>
			<dd class="mt-1 text-3xl font-bold tracking-tight text-white">
				{formatPrice(total)}
			</dd>
		</dl>

		<ul role="list" class="divide-y divide-white divide-opacity-10 text-sm font-medium">
			{#each items as item}
				<li class="flex items-start space-x-4 py-6">
					<img
						src={item.thumbnail}
						alt={item.description}
						class="h-20 w-20 flex-none rounded-md object-cover object-center"
					/>
					<div class="flex-auto space-y-1">
						<h3 class="text-white">{item.title}</h3>
						<p>{item.description}</p>
						<p>{item.quantity}</p>
					</div>
					<p class="flex-none text-base font-medium text-white">
						{formatPrice(item.unit_price)}
					</p>
				</li>
			{/each}
		</ul>

		<dl class="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
			<div class="flex items-center justify-between">
				<dt>Subtotal</dt>
				<dd>{formatPrice(subtotal)}</dd>
			</div>

			<div class="flex items-center justify-between">
				<dt>Shipping</dt>
				<dd>{formatPrice(shipping_total)}</dd>
			</div>

			<div class="flex items-center justify-between">
				<dt>Taxes</dt>
				<dd>{formatPrice(tax_total)}</dd>
			</div>

			<div
				class="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white"
			>
				<dt class="text-base">Total</dt>
				<dd class="text-base">{formatPrice(total)}</dd>
			</div>
		</dl>
	</div>
</section>
