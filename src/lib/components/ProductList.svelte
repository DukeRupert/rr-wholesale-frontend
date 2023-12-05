<script lang="ts">
	import type { ProductDTO } from '@medusajs/types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatPrice } from '$lib/utilities';
	import { addToast } from './toast/index.svelte';
	export let products: ProductDTO[] = [];
</script>

<div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-gray-900">Wholesale Producs</h1>
			<p class="mt-2 text-sm text-gray-700">
				Please add the products you want to order to your cart and checkout.
			</p>
		</div>
		<!-- <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Add user</button
			>
		</div> -->
	</div>
	<div class="-mx-4 mt-8 sm:-mx-0">
		<table class="min-w-full table-auto divide-y divide-gray-300">
			<thead>
				<tr>
					<th
						scope="col"
						class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
						>Product Title</th
					>
					<th
						scope="col"
						class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
						>Variant Title</th
					>
					<th
						scope="col"
						class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
						>Available Quantity</th
					>
					<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
						>Options</th
					>
					<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
						>Price</th
					>
					<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
						<span class="sr-only">Actions</span>
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each products as product, index}
					<tr>
						<td
							class="max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0"
							rowSpan={product.variants.length + 1}
						>
							<div class="flex flex-col space-y-2 items-center text-center">
								{product.title}
								{#if product.variants.length > 1}
									<img
										class="mt-4 w-20 h-auto lg:w-28"
										src={product.images[0]?.url ?? ''}
										alt={product.title}
									/>
								{/if}
							</div></td
						>
					</tr>
					{#each product.variants as variant}
						<tr>
							<td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{variant.title}</td>
							<td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
								{variant.inventory_quantity}
							</td>
							<td class="px-3 py-4 text-sm text-gray-500">
								<ul>
									{#each variant.options as option}
										<li>
											{product.options.find((op) => op.id === option.option_id)?.title}: {option.value}
										</li>
									{/each}
								</ul></td
							>
							<td class="px-3 py-4 text-sm text-gray-500"
								>{formatPrice(
									variant.prices.find((price) => price.currency_code === 'usd')?.amount
								)}</td
							>
							<td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
								<form
									action="/cart?/add"
									use:enhance={({ formData }) => {
										const quantity = formData.get('quantity');
										return async ({ result }) => {
											if (result.type === 'success') {
												addToast({
													data: {
														type: 'success',
														title: 'Success',
														description: `${quantity} ${variant.title} added to cart`
													}
												});
												await invalidateAll();
											}
										};
									}}
									method="post"
									class="ml-auto flex flex-col space-y-2 w-28 md:w-40"
								>
									<label for="quantity" class="sr-only">Quantity</label>
									<input type="number" name="quantity" id="quantity" class="rounded-md" />
									<input type="hidden" name="variantId" value={variant.id} />
									<button type="submit" class="mt-6 btn">
										Add <span class="hidden md:inline">to cart</span>
									</button>
								</form>
							</td></tr
						>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
</div>
