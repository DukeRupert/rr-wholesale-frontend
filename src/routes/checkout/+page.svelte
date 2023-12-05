<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utilities';
	import { company } from '$lib/constants';
	import { goto } from '$app/navigation';
	import Address from '$lib/components/Address.svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	let user = data.user;
	let cart = data.cart;
	$: items = cart?.items || [];
	$: console.log(cart);

	let clientSecret: string;
	let shippingOptions: any[];
	let shippingOptionId: string;
	let addressContainer: any;
	let order: any;

	let orderSummaryOpen = false;
	let success = false;
	let processing = false;
	let loading = true;
	let errorMessage = '';

	const toggleOrderSummary = () => {
		let orderSummary = document.getElementById('order-summary') as HTMLElement;
		if (orderSummaryOpen) {
			orderSummary.classList.add('hidden');
			orderSummaryOpen = false;
		} else {
			orderSummary.classList.remove('hidden');
			orderSummaryOpen = true;
		}
	};

	let contacts = [];
	if (user.shipping_addresses) {
		for (let address of user.shipping_addresses) {
			contacts.push({
				name: address.first_name + ' ' + address.last_name,
				address: {
					line1: address.address_1,
					line2: address.address_2,
					city: address.city,
					state: address.province,
					postal_code: address.postal_code,
					country: address.country_code.toUpperCase()
				}
			});
		}
	}

	let addressOptions = {
		contacts: contacts
	};

	const splitName = (name = '') => {
		const [firstName, ...lastName] = name.split(' ').filter(Boolean);
		return {
			firstName: firstName,
			lastName: lastName.join(' ')
		};
	};

	const saveAddress = async (value) => {
		let address = {
			first_name: value.firstName,
			last_name: value.lastName,
			address_1: value.address.line1,
			address_2: value.address.line2,
			city: value.address.city,
			province: value.address.state,
			postal_code: value.address.postal_code,
			country_code: value.address.country.toLowerCase()
		};
		let newAddress = true;

		for (let existing of user.shipping_addresses) {
			if (JSON.stringify(address) === JSON.stringify(existing)) {
				newAddress = false;
			}
		}

		address.phone = value.phone; // add after to not break the comparison above
		if (newAddress) {
			let success = await fetch('/checkout/save-address', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(address)
			})
				.then((res) => res.ok)
				.catch(() => false);
			if (!success) return false;
		}
		return await fetch('/checkout/shipping-address', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(address)
		})
			.then((res) => res.json())
			.catch(() => false);
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
			for (let shippingOption of shippingOptions) {
				if (shippingOption.name === 'Free Shipping') {
					shippingOptionId = shippingOption.id;
					cart = await saveShippingOption(shippingOptionId);
					break;
				}
			}
			if (!shippingOptionId) {
				shippingOptionId = shippingOptions[0].id;
				cart = await saveShippingOption(shippingOptionId);
			}
			loading = false;
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		await startCheckout();
	});
</script>

<!-- <SEO title="Checkout" description="Checkout page for {PUBLIC_SITE_NAME}" /> -->

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

				<form>
					<div class="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
						<div class="mt-10">
							<h3 class="text-lg font-medium text-gray-900">Shipping address</h3>

							<div class="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
								<div class="sm:col-span-3">
									<label for="address" class="block text-sm font-medium text-gray-700"
										>Address</label
									>
									<div class="mt-1">
										<input
											type="text"
											id="address"
											name="address"
											autocomplete="street-address"
											class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<label for="city" class="block text-sm font-medium text-gray-700">City</label>
									<div class="mt-1">
										<input
											type="text"
											id="city"
											name="city"
											autocomplete="address-level2"
											class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<label for="region" class="block text-sm font-medium text-gray-700"
										>State / Province</label
									>
									<div class="mt-1">
										<input
											type="text"
											id="region"
											name="region"
											autocomplete="address-level1"
											class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
										/>
									</div>
								</div>

								<div>
									<label for="postal-code" class="block text-sm font-medium text-gray-700"
										>Postal code</label
									>
									<div class="mt-1">
										<input
											type="text"
											id="postal-code"
											name="postal-code"
											autocomplete="postal-code"
											class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
										/>
									</div>
								</div>
							</div>
						</div>

						<div class="mt-10">
							<h3 class="text-lg font-medium text-gray-900">Billing information</h3>

							<div class="mt-6 flex items-center">
								<input
									id="same-as-shipping"
									name="same-as-shipping"
									type="checkbox"
									checked
									class="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
								/>
								<div class="ml-2">
									<label for="same-as-shipping" class="text-sm font-medium text-gray-900"
										>Same as shipping information</label
									>
								</div>
							</div>
						</div>

						<div class="mt-10 flex justify-end border-t border-gray-200 pt-6">
							<button type="submit" class="btn">Pay now</button>
						</div>
					</div>
				</form>
			</section>
		</div>
	</div>
{/if}