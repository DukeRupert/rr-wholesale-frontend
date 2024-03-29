<script lang="ts" context="module">
	function sort_created_at(items: PricedProduct[], direction: 'asc' | 'desc'): PricedProduct[] {
		try {
			return items.slice().sort((a, b) => {
				// Convert 'created_at' to Date objects if they are strings
				const dateA = typeof a.created_at === 'string' ? new Date(a.created_at) : a.created_at;
				const dateB = typeof b.created_at === 'string' ? new Date(b.created_at) : b.created_at;

				if (!dateA || !dateB) return;
				if (direction === 'desc') {
					// Sort in descending order (newest to oldest)
					return dateB.getTime() - dateA.getTime();
				} else {
					// Sort in ascending order (newest to oldest)
					return dateA.getTime() - dateB.getTime();
				}
			});
		} catch (error) {
			console.log(error);
			return items;
		}
	}
</script>

<script lang="ts">
	import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
	import { formatPrice } from '$lib/utilities';
	import { CldImage } from 'svelte-cloudinary';

	export let products: PricedProduct[] = [];
	$: sorted_products = sort_created_at(products, 'asc');

	const fallback_image =
		'https://res.cloudinary.com/rr-wholesale/image/upload/v1710875912/RockabillyRoasting/cropped-RockabillyLogo_m8iqgy.png';
</script>

<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
	<div class="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
		{#each sorted_products as product}
			<div class="group relative">
				<div class="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-muted">
					<CldImage
						src={product?.thumbnail ?? fallback_image}
						alt={product?.title ?? 'A rockabilly product'}
						width="1000"
						height="912"
						class="object-cover object-center"
						sizes="(max-width: 640px) 80vw, 30vw"
					/>

					<div class="flex items-end p-4 opacity-0 group-hover:opacity-100" aria-hidden="true">
						<div
							class="w-full rounded-md bg-muted bg-opacity-75 px-4 py-2 text-center text-sm font-medium backdrop-blur backdrop-filter"
						>
							View Product
						</div>
					</div>
				</div>
				<div class="mt-4 flex items-center justify-between space-x-8 text-base font-medium">
					<h3>
						<a href={'products/' + product.handle}>
							<span aria-hidden="true" class="absolute inset-0"></span>
							{product.title}
						</a>
					</h3>
					{#if product?.variants[0] && product.variants[0]?.original_price}
						<p>{formatPrice(product.variants[0].original_price)}</p>
					{/if}
				</div>
				<p class="mt-1 text-sm text-gray-500">{product?.subtitle ?? ''}</p>
			</div>
		{/each}
	</div>
</div>
