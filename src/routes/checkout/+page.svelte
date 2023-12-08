<script lang="ts">
	import type { PageData } from './$types';
	import ShippingAddressForm from './ShippingAddressForm.svelte';
	import BillingAddressForm from './BillingAddressForm.svelte';
	import { formatPrice } from '$lib/utilities';
	import { company } from '$lib/constants';
	import type { Shippingaddress } from '$lib/types/user';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import AddressCard from '$lib/components/cards/AddressCard.svelte';
	import Checkbox from '$lib/components/elements/Checkbox.svelte';

	export let data: PageData;
	$: ({ user, cart } = data);
	$: items = cart?.items || [];
	$: console.log(cart);
	$: console.log(user);

	let clientSecret: string;
	let shippingOptions: any[];
	let shippingOptionId: string;
	let order: any;

	let orderSummaryOpen = false;
	let success = false;
	let processing = false;
	let loading = true;
	let errorMessage = '';

	// Track progress through form
	function filterAddresses(opt: Shippingaddress[], id: string) {
		let options: Shippingaddress[] = [];
		if (user.shipping_addresses && user.shipping_addresses.length > 1) {
			options = user.shipping_addresses.filter((el) => el.id !== id);
		}
		return options;
	}
	// Shipping address logic
	$: currentAddress = cart?.shipping_address ?? {};
	$: shipping_address_options = filterAddresses(
		user.shipping_addresses,
		cart?.shipping_address?.id ?? ''
	);
	let isUpdatingAddress = false;

	// Billing address logic
	$: currentBillingAddress = cart?.billing_address ?? {};
	let same_as_shipping = true;
	let changeBillingAddress = false;
	const handleBillingEvent = (e: any): void => {
		same_as_shipping = !same_as_shipping;
	};

	const splitName = (name = '') => {
		const [firstName, ...lastName] = name.split(' ').filter(Boolean);
		return {
			firstName: firstName,
			lastName: lastName.join(' ')
		};
	};

	const saveShippingOption = async (id: string) => {
		if (!shippingOptionId) return false;
		return await fetch('/checkout/shipping-option', {
			method: 'POST',
			body: JSON.stringify({ option_id: id })
		})
			.then((res) => res.json())
			.catch(() => false);
	};

	const startCheckout = async () => {
		console.log('Start checkout');
		try {
			let response = await fetch('/checkout/initialize');
			const data = await response.json();
			cart = data.cart;
			clientSecret = data.cart.payment_session.data.client_secret;
			shippingOptions = data.shippingOptions;
			// for (let shippingOption of shippingOptions) {
			// 	if (shippingOption.name === 'Free Shipping') {
			// 		shippingOptionId = shippingOption.id;
			// 		cart = await saveShippingOption(shippingOptionId);
			// 		break;
			// 	}
			// }
			// if (!shippingOptionId) {
			// 	shippingOptionId = shippingOptions[0].id;
			// 	cart = await saveShippingOption(shippingOptionId);
			// }
			loading = false;
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		await startCheckout();
	});
</script>

{#if errorMessage}
	<p>{errorMessage}</p>
{:else if success}
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
{:else if !loading}
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
						<h3 class="text-lg font-medium text-gray-900">Shipping address</h3>
						{#if currentAddress && currentAddress?.address_1 && !isUpdatingAddress}
							<div class="mt-6">
								<AddressCard data={currentAddress} />
							</div>
							<button
								on:click={() => (isUpdatingAddress = true)}
								class="mt-6 text-sm text-thunderbird-500">Change address?</button
							>
						{:else}
							<ShippingAddressForm
								data={data.shippingAddressForm}
								shipping_addresses={shipping_address_options}
								bind:processing
								bind:isUpdatingAddress
							/>
						{/if}
					</div>
					<div class="mt-10">
						<h3 class="text-lg font-medium text-gray-900">Billing information</h3>

						{#if currentBillingAddress && currentBillingAddress?.address_1}
							<div class="mt-6">
								<AddressCard data={currentBillingAddress} />
							</div>
							<button
								on:click={() => {
									changeBillingAddress = true;
									same_as_shipping = false;
								}}
								class="mt-6 text-sm text-thunderbird-500">Change address?</button
							>
						{:else if !same_as_shipping}
							<BillingAddressForm
								data={data.billingAddressForm}
								bind:processing
								on:cancel={handleBillingEvent}
							/>
						{:else}
							<div class="mt-6 flex items-center">
								<Checkbox name="same-as-shipping" defaultChecked on:toggle={handleBillingEvent} />
								<div class="ml-2">
									<label for="same-as-shipping" class="text-sm font-medium text-gray-900"
										>Same as shipping information</label
									>
								</div>
							</div>
						{/if}
					</div>
				</div>
				<form
					action="?/completeCart"
					method="POST"
					use:enhance={async ({ cancel }) => {
						if (processing) cancel();
						processing = true;

						return async ({ result }) => {
							if (result.status === 200) {
								success = true;
								order = result.data.order;
							}
						};
					}}
				>
					<div class="mt-10 flex justify-end border-t border-gray-200 pt-6">
						<button type="submit" class="btn">Pay now</button>
					</div>
				</form>
			</section>
		</div>
	</div>
{/if}
