<script lang="ts">
	import type { Cart } from '@medusajs/medusa/dist/models/cart';
	import type { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
	import { formatPrice, handle_toast } from '$lib/utilities';
	import { Label } from '$lib/components/ui/label';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { createEventDispatcher } from 'svelte';

	export let data: PricedShippingOption[];
	export let shipping_method_id: string;
	
	const dispatch = createEventDispatcher<{success: { cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>}}>();

	async function selectShippingOption(id: string) {
		try {
			const res = await fetch('/checkout/select-shipping-option', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ option_id: id })
			});
			const { success, cart } = await res.json();
			if (success) {
				handle_toast({ type: 'success', text: 'Shipping option saved' });
				dispatch('success', {cart});
			} else {
				handle_toast({ type: 'error', text: 'Failed to update shipping option' });
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function handleClick(e: any) {
		const id = e.detail.currentTarget.id as string;
		if (!id) {
			handle_toast({ type: 'error', text: 'Invalid address' });
			return;
		} else {
			await selectShippingOption(id);
		}
	}
</script>

<div class="mt-4">
	<legend class="sr-only">Shipping Methods</legend>
	<RadioGroup.Root value={shipping_method_id}>
		{#each data as option, i}
			{#if option.id}
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value={option.id} id={option.id} on:click={handleClick} />
					<Label for={`option-${i}`}>{option.name} - {formatPrice(option?.amount ?? 0)}</Label>
				</div>
			{/if}
		{/each}
	</RadioGroup.Root>
</div>

<!-- <fieldset class="mt-4">
	<legend class="sr-only">Shipping Methods</legend>
	<div use:melt={$root} class="space-y-4" aria-label="shipping methods">
		{#each data as option}
			{#if option.id}
				<div class="flex items-center px-2 py-4 rounded-lg bg-white dark:bg-gray-800 shadow">
					<button
						use:melt={$item(option.id)}
						on:m-click={handleClick}
						on:m-keydown={handleClick}
						class="h-4 w-4 border-gray-300 border-2 rounded-full text-thunderbird-600 ring-thunderbird-600 focus:ring-2 focus:ring-space-2"
						id={option.id}
						aria-labelledby="{option.name}-label"
					>
						{#if $isChecked(option.id)}
							<div class="h-3 w-3 rounded-full bg-thunderbird-600" />
						{/if}
					</button>
					<label
						class="ml-3 block text-sm font-medium leading-6 text-gray-900"
						for={option.id}
						id="{option.id}-label"
					>
						{option.name} - {formatAmount(option?.amount)}
					</label>
				</div>
			{/if}
		{/each}
		<input name="line-height" use:melt={$hiddenInput} />
	</div>
</fieldset> -->
