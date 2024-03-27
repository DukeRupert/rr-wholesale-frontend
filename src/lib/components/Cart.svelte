<script lang="ts">
	import type { Cart } from '@medusajs/medusa/dist/models/cart';
	import { ShoppingCart, Trash, LucideLoader, Frown } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { formatPrice } from '$lib/utilities';
	import { handle_toast } from '$lib/utilities';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { is_cart_open } from '$lib/stores';

	export let cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
	export let count: number | null;

	$: items = cart?.items || [];
	$: total = cart?.subtotal ?? 0;

	let processing = false;
	let tainted = false;
	interface UpdateItem {
		id: string;
		quantity: number;
	}

	let updates: UpdateItem[] = [];

	function updateQuantity(id: string, quantity: number) {
		tainted = true;
		const existingIndex = updates.findIndex((item) => item.id === id);

		if (existingIndex !== -1) {
			// Update existing item
			updates[existingIndex].quantity = quantity;
		} else {
			// Add new item
			updates.push({ id, quantity });
			updates = updates;
		}
	}

	async function updateItem(line_item_id: string, quantity: number) {
		const res = await fetch('/api/cart/update', {
			method: 'POST',
			body: JSON.stringify({ line_item_id, quantity })
		});
		const { success } = (await res.json()) as { success: boolean };
		return success;
	}

	function allTrue(booleanArray: boolean[]): boolean {
		for (const element of booleanArray) {
			if (!element) {
				return false;
			}
		}
		return true;
	}

	async function updateAllItems() {
		processing = true;
		let results: boolean[] = [];
		for (const update of updates) {
			try {
				let response = await updateItem(update.id, update.quantity);
				results.push(response);
			} catch (error) {
				console.error(`Error updating item ${update.id}:`, error);
				handle_toast({ type: 'error', text: 'Failed to update some items' });
			}
		}
		let status = allTrue(results);
		if (status) {
			handle_toast({ type: 'success', text: 'Cart updated' });
		} else {
			handle_toast({ type: 'error', text: 'Failed to updates some items' });
		}
		// reset
		processing = false;
		tainted = false;
		updates = [];
		await invalidateAll();
	}

	async function deleteItem(line_item_id: string) {
		try {
			console.log(`Delete item: ${line_item_id}`);
			processing = true;
			const res = await fetch('/api/cart/delete', {
				method: 'POST',
				body: JSON.stringify({ line_item_id })
			});
			const { success } = await res.json();
			if (success) {
				invalidateAll();
			}
		} catch (error) {
			console.log(error);
			handle_toast({ type: 'error', text: 'Failed to delete item' });
		} finally {
			processing = false;
		}
	}
</script>

<Sheet.Root bind:open={$is_cart_open}>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline"
			><span class="sr-only">View cart</span>
			<ShoppingCart class="h-6 w-6 flex-shrink-0" />
			{#if count && count > 0}
				<span class="ml-2 text-sm font-medium">{count}</span>
				<span class="sr-only">items in cart, view bag</span>
			{/if}</Button
		>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Cart</Sheet.Title>
			<Sheet.Description>
				Click the checkout button when you are ready to place an order.
			</Sheet.Description>
		</Sheet.Header>
		<ul role="list" class="mt-4 divide-y">
			{#if items && items.length > 0}
				{#each items as item, i}
					<li class="grid grid-cols-2 gap-2 py-6">
						<div class="flex h-auto w-12 sm:w-16 my-auto">
							<AspectRatio ratio={12 / 11} class="bg-muted cursor-pointer flex-shrink-0">
								<img src={item.thumbnail} alt={item.description} class="rounded-md object-cover" />
							</AspectRatio>
						</div>
						<div class="flex flex-col">
							<div>
								<div class="flex justify-between">
									<a
										data-sveltekit-reload
										href={`/product/${item.variant.product.handle}?variant=${item.variant_id}`}
										class="cursor-pointer text-sm"
									>
										<div class="font-medium">
											{item.title}
										</div>
										<p class="mt-1 text-sm">
											{item.description}
										</p>
									</a>
									<div>
										<p class="ml-4 text-sm font-medium">
											{formatPrice(item.unit_price)}
										</p>
										<p class="ml-4 text-sm">
											Qty: {item.quantity}
										</p>
									</div>
								</div>
							</div>
							<div class="mt-4 flex items-center">
								<Input
									type="number"
									name="quantity"
									id="quantity"
									min="1"
									value={item.quantity}
									on:change={(v) => updateQuantity(item.id, parseInt(v.currentTarget.value))}
									class="w-full max-w-[120px]"
								/>

								<Button
									type="button"
									size="icon"
									variant="ghost"
									disabled={processing}
									on:click={() => deleteItem(item.id)}
								>
									<Trash class="h-5 w-5" />
								</Button>
							</div>
						</div>
					</li>
				{/each}
				<Sheet.Footer class="flex-col sm:flex-col space-y-4 sm:space-x-0">
					<div class="mt-6">
						<dl class="space-y-4">
							<div class="flex items-center justify-between">
								<dt class="text-base font-medium">Subtotal</dt>
								<dd class="ml-4 text-base font-medium">{formatPrice(total)}</dd>
							</div>
						</dl>
						<p class="mt-1 text-sm text-muted-foreground">
							Shipping and taxes will be calculated at checkout.
						</p>
					</div>
					{#if tainted}
						<Button type="button" on:click={updateAllItems} class="w-full">
							{#if processing}
								<LucideLoader class="h-6 w-6 animate-spin" />
							{:else}
								Update cart
							{/if}
						</Button>
					{:else}
						<Sheet.Close asChild let:builder>
							<Button href="/checkout" builders={[builder]} class="w-full">
								{#if processing}
									<LucideLoader class="h-6 w-6 animate-spin" />
								{:else}
									Checkout
								{/if}
							</Button>
						</Sheet.Close>
					{/if}
				</Sheet.Footer>
			{:else}
				<div class="my-6 flex flex-col space-y-4 items-center">
					<div><Frown class="h-8 w-8" /></div>
					<p>Your cart is empty</p>
					<Button type="button" variant="link" on:click={() => ($is_cart_open = false)}
						>Continue shopping</Button
					>
				</div>
			{/if}
		</ul>
	</Sheet.Content>
</Sheet.Root>
