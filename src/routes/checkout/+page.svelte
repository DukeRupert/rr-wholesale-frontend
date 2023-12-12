<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { TruckIcon, HomeIcon } from 'lucide-svelte';
	import ShippingAddressForm from './ShippingAddressForm.svelte';
	import ShippingSelect from '$lib/components/ShippingSelect.svelte';
	import AddressCard from '$lib/components/cards/AddressCard.svelte';
	import CartSummary from './CartSummary.svelte';
	import OrderSummary from './OrderSummary.svelte';

	export let data: PageData;
	$: ({ user, cart, shippingOptions, shippingAddressForm } = data);
	$: ({ shipping_addresses } = user);

	let order: any; // Order data
	let success = false; // Order confirmed
	let processing = false;

	// Shipping address logic
	let isUpdatingAddress = false;
	async function handleShippingOptionClick(e: any) {
		console.log('Option selected');
		const shippingOptionId = e.detail.id as string;
		await selectShippingOption(shippingOptionId);
	}

	// Shipping Method
	let isShippingMethodSelected = false;
	async function fetchShippingOptions() {
		console.log('fetching shipping options');
		try {
			shippingOptions = await fetch('/checkout/get-shipping-options').then((res) => res.json());
		} catch (err) {
			console.log(err);
		}
	}
	async function selectShippingOption(id: string) {
		console.log(`Selecting shipping option: ${id}`);
		try {
			cart = await fetch('/checkout/select-shipping-option', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ option_id: id })
			}).then((res) => res.json());
			if (cart) isShippingMethodSelected = true;
		} catch (err) {
			console.log(err);
		}
	}
</script>

{#if success}
	<OrderSummary data={order} />
{:else if !cart?.items}
	<p>Your cart is empty.</p>
{:else}
	<div class="bg-white">
		<!-- Background color split screen for large screens -->
		<div class="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block" aria-hidden="true"></div>
		<div class="fixed right-0 top-0 hidden h-full w-1/2 bg-black lg:block" aria-hidden="true"></div>

		<div
			class="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16"
		>
			<h1 class="sr-only">Checkout</h1>
			<CartSummary data={cart} />
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
						{#if cart.shipping_address && cart.shipping_address?.address_1 && !isUpdatingAddress}
							<div class="mt-6">
								<AddressCard data={cart.shipping_address} />
							</div>
							<button
								on:click|preventDefault={() => (isUpdatingAddress = true)}
								class="mt-6 text-sm text-thunderbird-500">Change address?</button
							>
						{:else}
							<ShippingAddressForm
								data={shippingAddressForm}
								{shipping_addresses}
								bind:processing
								bind:isUpdatingAddress
								on:addressUpdated={fetchShippingOptions}
							/>
						{/if}
					</div>
					<!-- Shipping Method -->
					<div class="mt-10">
						<div class="flex items-center space-x-2">
							<TruckIcon class="block h-6 w-6 text-gray-500 dark:text-gray-400" />
							<h3 class="text-lg font-medium text-gray-900">Shipping Method</h3>
						</div>

						<ShippingSelect data={shippingOptions} on:select={handleShippingOptionClick} />
						{#if !isShippingMethodSelected}
							<p class="ml-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
								Please select a shipping method.
							</p>
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
									order = result.data.order;
									success = true;
								}
							};
						}}
					>
						<div class="mt-10 flex justify-end border-t border-gray-200 pt-6">
							<button
								type="submit"
								disabled={!isShippingMethodSelected}
								class="btn disabled:opacity-80 disabled:pointer-events-none">Confirm order</button
							>
						</div>
					</form>
				</div>
			</section>
		</div>
	</div>
{/if}
