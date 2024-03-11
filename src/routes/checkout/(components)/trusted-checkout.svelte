<script lang="ts">
	import type { PageData } from '../$types';
	import { TruckIcon, HomeIcon, Loader } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
	import { Button } from '$lib/components/ui/button';
	import AddressBook from './address-book.svelte';
	import AddressCard from './address-card.svelte';
	import ShippingSelect from './shipping-select.svelte';
	import ShippingAddressForm from './shipping-address-form.svelte';
	import { handle_toast } from '$lib/utilities';

	export let data: PageData;
	export let processing: boolean;

	$: valid_shipping_address = data.cart?.shipping_address?.address_1 ?? '';
	$: billing_address_id = data.cart;
	$: shipping_method_id = data.cart?.shipping_methods[0]?.shipping_option_id ?? '';
	$: cart_ready = valid_shipping_address && billing_address_id && shipping_method_id ? true : false;

	// Shipping address logic
	let show_shipping_address_book = true;
	let show_shipping_address_form = false;
	let is_shipping_option_selected = false;
	let shipping_options: PricedShippingOption[] = [];

	async function fetchShippingOptions() {
		console.log('fetching shipping options');
		try {
			return await fetch('/checkout/get-shipping-options').then((res) => res.json());
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	async function handle_address_form_success() {
		show_shipping_address_book = false;
		show_shipping_address_form = false;
		shipping_options = await fetchShippingOptions();
	}

	onMount(async () => {
		// If shipping address exists close the tab
		if (data.cart?.shipping_address?.address_1) {
			shipping_options = await fetchShippingOptions();
			show_shipping_address_book = false;
		}
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
		<div class="mt-10">
			<div class="flex items-center space-x-2">
				<HomeIcon class="block h-5 w-5 text-gray-500 dark:text-gray-400" />
				<h3 class="text-lg font-medium text-gray-900">Shipping address</h3>
			</div>
			{#if show_shipping_address_book}
				{#if show_shipping_address_form}
					<ShippingAddressForm
						data={data.form}
						{processing}
						on:success={handle_address_form_success}
						on:cancel={async () => {
							show_shipping_address_form = false;
						}}
					/>
				{:else}
					<AddressBook
						data={data.user?.shipping_addresses}
						on:success={() => (show_shipping_address_book = false)}
						on:new={() => (show_shipping_address_form = true)}
					/>
				{/if}
			{:else if valid_shipping_address && data.cart.shipping_address}
				<div class="mt-6">
					<AddressCard data={data.cart.shipping_address} {processing} is_selected={true}/>
				</div>
				<Button on:click={() => (show_shipping_address_book = true)} variant="outline" class="mt-6"
					>Change address?</Button
				>
			{/if}
		</div>
		<!-- Shipping Method -->
		{#if data.cart?.shipping_address_id}
			<div class="mt-10">
				<div class="flex items-center space-x-2">
					<TruckIcon class="block h-6 w-6 text-gray-500 dark:text-gray-400" />
					<h3 class="text-lg font-medium text-gray-900">Shipping Method</h3>
				</div>
				{#await shipping_options}
					<div class="h-full w-full flex items-center justify-center p-4">
						<Loader class="h-5 w-5 animate-spin" />
					</div>
				{:then options}
					<ShippingSelect
						data={options}
						{shipping_method_id}
						on:success
					/>
					{#if !is_shipping_option_selected}
						<p class="ml-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
							Please select a shipping method.
						</p>
					{/if}
				{/await}
			</div>
		{/if}
		<!-- Confirm Order -->
		<form
			action="?/completeCart"
			method="POST"
			use:enhance={async ({ cancel }) => {
				if (processing) cancel();
				processing = true;
				return async ({ result }) => {
					if (result.status === 200) {
						goto('/thank-you', { invalidateAll : true});
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
