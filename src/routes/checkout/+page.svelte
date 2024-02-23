<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { TruckIcon, HomeIcon } from 'lucide-svelte';
	import ShippingAddressForm from './ShippingAddressForm.svelte';
	import ShippingSelect from '$lib/components/ShippingSelect.svelte';
	import AddressCard from '$lib/components/cards/AddressCard.svelte';
	import CartSummary from './CartSummary.svelte';
	import OrderSummary from './OrderSummary.svelte';
	import { addToast } from '$lib/components/toast/index.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { Elements, PaymentElement, Address } from 'svelte-stripe';
	import type {
		Stripe,
		StripeElementsOptions,
		StripePaymentElementOptions,
		ContactOption
	} from '@stripe/stripe-js';
	import type { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
	import type { Cart } from '@medusajs/medusa/dist/models/cart';
	import type { Address as MedusaAddress } from '@medusajs/medusa/dist/models/address';

	onMount(async () => {
		init = init_checkout();
	});

	export let data: PageData;
	$: ({ user, cart, shipping_address_form } = data);
	$: is_trusted = user?.metadata?.is_trusted ?? false;
	$: console.log(`is_trusted: ${is_trusted}`);
	$: console.log(cart);
	let shipping_options: PricedShippingOption[] = [];
	let contacts: ContactOption[] = [];

	let init: Promise<void>;
	let stripe: Stripe | null;
	let client_secret: string = '';
	let elements: any; // stripe elements
	let elements_options: StripeElementsOptions = {
		mode: 'payment'
	};
	let order: any; // Order data
	let error = null;
	let success = false; // Order confirmed
	let processing = false;

	interface Initialize_Cart {
		cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
		shipping_options: PricedShippingOption[];
	}

	const init_checkout = async () => {
		console.log('init_checkout()');
		processing = true;
		try {
			stripe = await loadStripe(PUBLIC_STRIPE_KEY);
			let init_res = await fetch('/checkout/initialize-cart');
			if (init_res.status !== 200) console.log('Error occured initializing cart');
			const init_data = (await init_res.json()) as Initialize_Cart;
			cart = init_data.cart;
			let s = cart?.payment_session?.data?.client_secret ?? '';
			if (typeof s === 'string' && s) client_secret = s;
			console.log(`client_secret: ${client_secret}`);
			elements_options.clientSecret = client_secret;

			const shipping_option_res = await fetch('/checkout/get-shipping-options');
			if (shipping_option_res.status !== 200) console.log('Error occured initializing cart');
			shipping_options = (await shipping_option_res.json()) as PricedShippingOption[];

			contacts = createContacts(data?.user?.shipping_addresses || []);
		} catch (err) {
			console.log(err);
		}
		processing = false;
	};

	async function submit() {
		// avoid processing duplicates
		if (processing) return;
		if (stripe === null) {
			error = 'Error loading stripe';
			return;
		}

		processing = true;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging
		console.log({ result });

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page
			goto('/thank-you');
		}
	}

	const createContacts = (addresses: MedusaAddress[]): ContactOption[] => {
		const contacts: ContactOption[] = [];

		for (let address of addresses) {
			contacts.push({
				name: address.first_name + ' ' + address.last_name,
				address: {
					line1: address?.address_1 ?? '',
					line2: address?.address_2 ?? '',
					city: address?.city ?? '',
					state: address?.province ?? '',
					postal_code: address?.postal_code ?? '',
					country: address?.country_code?.toUpperCase() ?? ''
				}
			});
		}
		return contacts;
	};

	const paymentOptions: StripePaymentElementOptions = {
		business: {
			name: 'Rockabilly Roasting'
		}
	};

	// Shipping address logic
	let show_shipping_address_form = false;
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
			shipping_options = await fetch('/checkout/get-shipping-options').then((res) => res.json());
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
			{#if is_trusted}
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
							{#if cart.shipping_address && cart.shipping_address?.address_1 && !show_shipping_address_form}
								<div class="mt-6">
									<AddressCard data={cart.shipping_address} />
								</div>
								<button
									on:click|preventDefault={() => (show_shipping_address_form = true)}
									class="mt-6 text-sm text-thunderbird-500">Change address?</button
								>
							{:else}
								<ShippingAddressForm
									data={shipping_address_form}
									shipping_addresses={data?.user?.shipping_addresses ?? []}
									bind:processing
									on:cancel={() => (show_shipping_address_form = false)}
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

							<ShippingSelect data={shipping_options} on:select={handleShippingOptionClick} />
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
										goto('/thank-you');
									} else {
										addToast({
											data: {
												type: 'error',
												title: 'Error',
												description:
													'An error occured during checkout. Please contact tech support if this problem persists.'
											}
										});
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
			{:else}
				{#await init then}
					<!-- Stripe -->
					<form
						method="POST"
						action="/checkout?/completeCart"
						use:enhance={async ({ cancel }) => {
							// avoid processing duplicates
							if (processing) cancel();
							processing = true;
							console.log('processing payment');
							if (!stripe) {
								// stop if stripe didn't load
								addToast({
									data: {
										type: 'error',
										title: 'Error',
										description: 'Stripe client failed to load.'
									}
								});
								cancel();
							} else {
								// confirm payment with stripe
								const result = await stripe.confirmPayment({
									elements,
									redirect: 'if_required'
								});
								console.log('Result: \n');
								// log results, for debugging
								console.log({ result });

								if (result.error) {
									// payment failed, notify user
									error = result.error;
									processing = false;
								} else {
									return async ({ result }) => {
										console.log('No error. See response');
										console.log(result);
										console.log('SUCCESS!');
										if (result.status === 200) goto('/thank-you');
									};
								}
							}
						}}
					>
						{#if stripe && client_secret}
							<Elements
								{stripe}
								clientSecret={client_secret}
								bind:elements
								theme="flat"
								labels="floating"
								variables={{ colorPrimary: 'black' }}
							>
								<PaymentElement options={paymentOptions} />
								<Address mode="shipping" {contacts} />
							</Elements>
						{/if}

						<!-- Shipping Method -->
						<div class="mt-10">
							<div class="flex items-center space-x-2">
								<TruckIcon class="block h-6 w-6 text-gray-500 dark:text-gray-400" />
								<h3 class="text-lg font-medium text-gray-900">Shipping Method</h3>
							</div>

							<ShippingSelect data={shipping_options} on:select={handleShippingOptionClick} />
							{#if !isShippingMethodSelected}
								<p class="ml-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
									Please select a shipping method.
								</p>
							{/if}
						</div>

						<button disabled={processing} type="submit" class="flex w-full mt-6 btn">Pay</button>
					</form>
				{/await}
			{/if}
		</div>
	</div>
{/if}
