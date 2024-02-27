<script lang="ts">
	import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utilities';
	import { addToast } from './toast/index.svelte';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Input } from "$lib/components/ui/input";
	import * as Table from '$lib/components/ui/table';
	export let products: PricedProduct[] = [];
	console.log(products);
</script>

<div class="-mx-4 mt-8 sm:-mx-0">
	<Table.Root class="min-w-full table-auto divide-y">
		<Table.Header>
			<Table.Row>
				<Table.Head scope="col">Product Title</Table.Head>
				<Table.Head scope="col" class="hidden lg:table-cell">Variant Title</Table.Head>
				<Table.Head scope="col" class="hidden sm:table-cell">Available Quantity</Table.Head>
				<Table.Head scope="col">Options</Table.Head>
				<Table.Head scope="col">Price</Table.Head>
				<Table.Head scope="col">
					<span class="sr-only">Actions</span>
				</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body class="divide-y">
			{#each products as product, index}
				<Table.Row>
					<Table.Cell
						class="max-w-0 py-4 pl-4 pr-3 text-sm font-medium sm:w-auto sm:max-w-none sm:pl-0"
						rowspan={product.variants.length + 1}
					>
						<div class="flex flex-col space-y-2 items-center text-center">
							{product.title}
							<!-- <div class="h-24 w-24 my-auto">
								<AspectRatio ratio={12 / 11} class="bg-muted cursor-pointer flex-shrink-0">
									<img
										src={product?.images[0]?.url ?? ''}
										alt={product.title}
										class="rounded-md object-cover"
									/>
								</AspectRatio>
							</div> -->
							<!-- {#if product.variants.length > 1 && product.images}
								<img
									class="mt-4 w-20 h-auto lg:w-28"
									src={product.images[0]?.url ?? ''}
									alt={product.title}
								/>
							{/if} -->
						</div></Table.Cell
					>
				</Table.Row>
				{#each product.variants as variant}
					<Table.Row>
						<Table.Cell class="hidden px-3 py-4 text-sm  lg:table-cell">{variant.title}</Table.Cell>
						<Table.Cell class="hidden px-3 py-4 text-sm sm:table-cell">
							{variant.inventory_quantity}
						</Table.Cell>
						<Table.Cell class="px-3 py-4 text-sm  capitalize">
							<ul>
								{#if variant.options}
									{#each variant.options as option, i}
										<li>
											{option.value}
										</li>
									{/each}
								{/if}
							</ul></Table.Cell
						>
						{#if variant.prices}
							<Table.Cell class="px-3 py-4 text-sm "
								>{formatPrice(
									variant.prices.find((price) => price.currency_code === 'usd')?.amount ?? 0
								)}</Table.Cell
							>
						{/if}
						<Table.Cell class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
							<form
								action="/cart?/add"
								use:enhance={({ formData }) => {
									const quantity = formData.get('quantity');
									return async ({ result, update }) => {
										if (result.type === 'success') {
											addToast({
												data: {
													type: 'success',
													title: 'Success',
													description: `${quantity} ${variant.title} added to cart`
												}
											});
											update();
										}
									};
								}}
								method="post"
								class="ml-auto flex flex-col space-y-2 w-20 md:w-40"
							>
								<label for="quantity" class="sr-only">Quantity</label>
								<Input type="number" name="quantity" id="quantity" />
								<input type="hidden" name="variantId" value={variant.id} />
								<button type="submit" class="mt-6 btn px-2 py-1">
									Add <span class="hidden md:inline">to cart</span>
								</button>
							</form>
						</Table.Cell></Table.Row
					>
				{/each}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
