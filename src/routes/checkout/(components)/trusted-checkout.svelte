<script lang="ts">
	import type { PageData } from '../$types';
	import { TruckIcon, Loader } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
	import type { Cart } from '@medusajs/medusa/dist/models/cart';
	import { Button } from '$lib/components/ui/button';
	import ShippingAddress from './trusted/shipping-address.svelte';
	import ShippingSelect from './trusted/shipping-select.svelte';
	import { handle_toast } from '$lib/utilities';

	export let data: PageData;
	export let processing: boolean;

	function is_cart_ready_to_complete(d: PageData): boolean {
		const { cart } = d;
		const { shipping_methods, shipping_address } = cart;
		if (!shipping_address?.address_1) {
			return false;
		}
		if (!shipping_methods[0]?.shipping_option_id) {
			return false;
		}
		return true;
	}
	let cart_ready = false;

	async function fetchShippingOptions(): Promise<PricedShippingOption[]> {
		try {
			return await fetch('/api/checkout/get-shipping-options').then((res) => res.json());
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async function handle_address_form_success() {
		await invalidateAll();
		await fetchShippingOptions();
		cart_ready = is_cart_ready_to_complete(data);
	}

	async function handle_shipping_method_success(
		e: CustomEvent<{ cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> }>
	) {
		const { cart: c } = e.detail;
		if (c) data.cart = c;
		cart_ready = is_cart_ready_to_complete(data);
	}

	onMount(async () => {
		// If shipping address exists close the tab
		if (data.cart?.shipping_address?.address_1) {
			await fetchShippingOptions();
		}
		cart_ready = is_cart_ready_to_complete(data);
	});
</script>

<!-- No payment info required -->
<!-- Shipping & Billing -->
<section
	aria-labelledby="payment-and-shipping-heading"
	class="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
>
	<h2 id="payment-and-shipping-heading" class="sr-only">Payment and shipping details</h2>
	<div class="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
		<!-- Shipping Address -->
		<ShippingAddress
			form={data.form}
			shipping_address={data?.cart?.shipping_address}
			shipping_addresses={data?.user?.shipping_addresses}
			on:success={handle_address_form_success}
		/>
		<!-- Shipping Method -->
		<div class="mt-10">
			<div class="flex items-center space-x-2">
				<TruckIcon class="block h-6 w-6 " />
				<h3 class="text-lg font-medium">Shipping Method</h3>
			</div>
			{#if browser}
				{#await fetchShippingOptions()}
					<div class="h-full w-full flex items-center justify-center p-4">
						<Loader class="h-5 w-5 animate-spin" />
					</div>
				{:then options}
					<ShippingSelect
						data={options}
						shipping_method_id={data.cart?.shipping_methods[0]?.shipping_option_id ?? ''}
						on:success={handle_shipping_method_success}
					/>
					{#if !data.cart?.shipping_methods[0]?.shipping_option_id}
						<p class="ml-2 mt-2 text-sm">Please select a shipping method.</p>
					{/if}
				{/await}
			{/if}
		</div>
		<!-- Confirm Order -->
		<form
			action="?/completeCart"
			method="POST"
			use:enhance={async ({ cancel }) => {
				if (processing) cancel();
				processing = true;
				return async ({ result }) => {
					if (result.status === 200) {
						goto('/thank-you', { invalidateAll: true });
					} else {
						handle_toast({
							type: 'error',
							text: 'An error occured during checkout. Please contact tech support if this problem persists.'
						});
					}
				};
			}}
		>
			<div class="mt-10 flex justify-end border-t border-gray-200 pt-6">
				<Button type="submit" variant="default" disabled={!cart_ready}>Confirm order</Button>
			</div>
		</form>
	</div>
</section>
