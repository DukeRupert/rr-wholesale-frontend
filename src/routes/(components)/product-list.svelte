<script lang="ts">
	import type { PricedProduct, PricedVariant } from '@medusajs/medusa/dist/types/pricing';
	import { invalidateAll } from '$app/navigation';
	import { formatPrice } from '$lib/utilities';
	import { handle_toast } from '$lib/utilities';
	import { Plus } from 'lucide-svelte';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';

	export let products: PricedProduct[] = [];
	console.log(products);

	let quantity: number = 0;
	let processing = false;

	async function addItem(product: PricedProduct, variant: PricedVariant, quantity: number) {
		try {
			processing = true;

			if (variant.id && quantity) {
				const res = await fetch('api/cart/add', {
					method: 'POST',
					body: JSON.stringify({ variant_id: variant.id, quantity })
				});
				const { success } = await res.json();
				if (success) {
					await invalidateAll();
					handle_toast({
						type: 'success',
						text: `${quantity} ${product.title} ${variant.title} added to cart`
					});
				} else {
					console.log(res);
					handle_toast({ type: 'error', text: 'An error occured adding the item to the cart' });
				}
			}
		} catch (error) {
			console.log(error);
			handle_toast({ type: 'error', text: 'An error occured adding the item to the cart' });
		} finally {
			processing = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
	<div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
		{#each products as product}
			<div class="group relative">
				<div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
					<img
						src="https://tailwindui.com/img/ecommerce-images/product-page-05-related-product-01.jpg"
						alt="Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background."
						class="object-cover object-center"
					/>
					<div class="flex items-end p-4 opacity-0 group-hover:opacity-100" aria-hidden="true">
						<div
							class="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"
						>
							View Product
						</div>
					</div>
				</div>
				<div
					class="mt-4 flex items-center justify-between space-x-8 text-base font-medium"
				>
					<h3>
						<a href={'products/' + product.handle}>
							<span aria-hidden="true" class="absolute inset-0"></span>
							{product.title}
						</a>
					</h3>
					<p>$49</p>
				</div>
				<p class="mt-1 text-sm text-gray-500">UI Kit</p>
			</div>
		{/each}
	</div>
</div>
