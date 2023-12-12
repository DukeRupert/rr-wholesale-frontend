<script lang="ts">
	import type { PageData } from './$types';
	import ShippingAddressForm from './ShippingAddressForm.svelte';
	import { formatPrice } from '$lib/utilities';
	import ShippingSelect from '$lib/components/ShippingSelect.svelte';
	import { company } from '$lib/constants';
	import { enhance } from '$app/forms';
	import AddressCard from '$lib/components/cards/AddressCard.svelte';
	import { TruckIcon, HomeIcon } from 'lucide-svelte';

	export let data: PageData;
	$: ({ user, cart, shippingOptions, shippingAddressForm } = data);
	$: ({ shipping_addresses } = user);
	$: console.log(cart);
	$: items = cart?.items || [];

	let order: any; // Order data
	let success = false; // Order confirmed
	let processing = false;

	// Shipping address logic
	let isUpdatingAddress = false;

	async function handleShippingOptionClick(e) {
		console.log('Option selected');
		const shippingOptionId = e.detail.id;
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
	<main class="lg:flex lg:min-h-full lg:flex-row-reverse lg:max-h-screen lg:overflow-hidden">
		<section class="flex-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-4 lg:pt-0">
			<div class="mx-auto max-w-lg">
				<!-- Logo on thank you screen -->
				<div class="py-10 lg:flex">
					<span class="sr-only">{company.name}</span>
					<a href="/"><img src={company.logo.src} alt={company.logo.alt} class="h-14 w-auto" /></a>
				</div>
				<p>Thank you for your order!</p>
				<p>
					Your order number is <a
						class="font-bold text-lime-600"
						href={`/account/order/${order.id}`}>{order.display_id}</a
					>
				</p>
				<p class="mt-6"><a href="/">&larr; Continue Shopping</a></p>
			</div>
		</section>
	</main>
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

			<section
				aria-labelledby="summary-heading"
				class="bg-black py-12 text-gray-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
			>
				<div class="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
					<h2 id="summary-heading" class="sr-only">Order summary</h2>

					<dl>
						<dt class="text-sm font-medium">Amount due</dt>
						<dd class="mt-1 text-3xl font-bold tracking-tight text-white">$232.00</dd>
					</dl>

					<ul role="list" class="divide-y divide-white divide-opacity-10 text-sm font-medium">
						{#each items as item}
							<li class="flex items-start space-x-4 py-6">
								<img
									src={item.thumbnail}
									alt={item.description}
									class="h-20 w-20 flex-none rounded-md object-cover object-center"
								/>
								<div class="flex-auto space-y-1">
									<h3 class="text-white">{item.title}</h3>
									<p>{item.description}</p>
									<p>{item.quantity}</p>
								</div>
								<p class="flex-none text-base font-medium text-white">
									{formatPrice(item.unit_price)}
								</p>
							</li>
						{/each}
						<!-- More products... -->
					</ul>

					<dl class="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
						<div class="flex items-center justify-between">
							<dt>Subtotal</dt>
							<dd>{formatPrice(cart.subtotal)}</dd>
						</div>

						<div class="flex items-center justify-between">
							<dt>Shipping</dt>
							<dd>{formatPrice(cart.shipping_total)}</dd>
						</div>

						<div class="flex items-center justify-between">
							<dt>Taxes</dt>
							<dd>{formatPrice(cart.tax_total)}</dd>
						</div>

						<div
							class="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white"
						>
							<dt class="text-base">Total</dt>
							<dd class="text-base">{formatPrice(cart.total)}</dd>
						</div>
					</dl>
				</div>
			</section>

			<section
				aria-labelledby="payment-and-shipping-heading"
				class="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
			>
				<h2 id="payment-and-shipping-heading" class="sr-only">Payment and shipping details</h2>
				<div class="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
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
					
						<div class="mt-10">
							<div class="flex items-center space-x-2">
								<TruckIcon class="block h-6 w-6 text-gray-500 dark:text-gray-400" />
								<h3 class="text-lg font-medium text-gray-900">Shipping Method</h3>
							</div>

							<ShippingSelect data={shippingOptions} on:select={handleShippingOptionClick} />
							{#if !isShippingMethodSelected}
								<p class="ml-2 mt-2 text-sm text-gray-500 dark:text-gray-400">Please select a shipping method.</p>
							{/if}
						</div>
					
					
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
								<button type="submit" disabled={!isShippingMethodSelected} class="btn disabled:opacity-80 disabled:pointer-events-none">Confirm order</button>
							</div>
						</form>
					
				</div>
			</section>
		</div>
	</div>
{/if}
