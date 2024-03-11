<script lang="ts">
	import type { PricedProduct, PricedVariant } from '@medusajs/medusa/dist/types/pricing';
	import { invalidateAll } from '$app/navigation';
	import { formatPrice } from '$lib/utilities';
	import { toast } from 'svelte-sonner';
	import { Plus } from 'lucide-svelte';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';

	export let products: PricedProduct[] = [];

	let quantity: number = 0;
	let processing = false;

	async function addItem(product: PricedProduct, variant: PricedVariant, quantity: number) {
		try {
			
		} catch (error) {
			
		}
		processing = true;
		
		if (variant.id && quantity) {
			const res = await fetch('api/cart/add', {
				method: 'POST',
				body: JSON.stringify({ variant_id: variant.id, quantity })
			});
			const { success } = await res.json();
			if (success) {
				await invalidateAll();
			} else {
				console.log('error');
			}
			toast.success(`${quantity} ${product.title} ${variant.title} added to cart`);
		} else {
			toast.error('Variant does not exist.');
		}
		processing = false;
	}
</script>

<div class="-mx-4 mt-8 sm:-mx-0">
	<Table.Root class="min-w-full table-auto divide-y">
		<Table.Header>
			<Table.Row>
				<Table.Head scope="col">Product</Table.Head>
				<Table.Head scope="col" class="hidden lg:table-cell">Variant</Table.Head>
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
							{#if product?.images && product.images.length > 0}
								<div class="h-12 w-12 sm:h-24 sm:w-24 my-auto">
									<AspectRatio ratio={12 / 11} class="mt-4 bg-muted cursor-pointer flex-shrink-0">
										<img
											src={product?.images[0]?.url ?? ''}
											alt={product.title}
											class="rounded-md object-cover"
										/>
									</AspectRatio>
								</div>
							{/if}
						</div></Table.Cell
					>
				</Table.Row>
				{#each product.variants as variant}
					<Table.Row>
						<Table.Cell class="hidden px-3 py-4 text-sm  lg:table-cell">{variant.title}</Table.Cell>
						{#if variant.prices}
							<Table.Cell class="px-3 py-4 text-sm "
								>{formatPrice(
									variant.prices.find((price) => price.currency_code === 'usd')?.amount ?? 0
								)}</Table.Cell
							>
						{/if}
						<Table.Cell
							class="flex flex-col sm:flex-row justify-end py-4 pl-3 pr-0 sm:pr-4 text-right text-sm font-medium"
						>
							<label for="quantity" class="sr-only">Quantity</label>
							<Input
								type="number"
								name="quantity"
								id="quantity"
								min=1
								on:change={(v) => (quantity = parseInt(v.currentTarget.value))}
								class="w-full max-w-[120px]"
							/>

							<Button
								type="button"
								variant="outline"
								aria-label="Add to cart"
								class="mt-4 sm:mt-0 sm:ml-6 max-w-[120px]"
								disabled={processing}
								on:click={() => addItem(product, variant, quantity)}
								><Plus class="h-4 w-4 sm:hidden" /><span class="hidden sm:block">Add to cart</span
								></Button
							>
						</Table.Cell></Table.Row
					>
				{/each}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
