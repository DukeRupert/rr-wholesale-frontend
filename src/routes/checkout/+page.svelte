<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { TruckIcon } from 'lucide-svelte';
	import ShippingSelect from './(components)/trusted/shipping-select.svelte';
	import CartSummary from './(components)/CartSummary.svelte';
	import { Button } from '$lib/components/ui/button';
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
	import TrustedCheckout from './(components)/trusted-checkout.svelte'

	export let data: PageData;
	$:( { cart } = data);

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

	// Stripe stuff
	let init: Promise<void>;
	let stripe: Stripe | null;
	let client_secret: string = '';
	let elements: any; // stripe elements
	let elements_options: StripeElementsOptions = {
		mode: 'payment'
	};
	let error = null;
	let processing = false;
	let contacts: ContactOption[] = []
	let shipping_options: PricedShippingOption[] = [];

	//
	$: shipping_address_id = data.cart;
	$: billing_address_id = data.cart;
	$: shipping_method_id = data.cart?.shipping_methods[0]?.shipping_option_id ?? '';
	$: cart_ready = shipping_address_id && billing_address_id && shipping_method_id ? true : false;

	interface Initialize_Cart {
		cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
		// shipping_options: PricedShippingOption[];
	}

	const init_stripe_checkout = async () => {
		console.log('init_stripe_checkout()');
		processing = true;
		try {
			stripe = await loadStripe(PUBLIC_STRIPE_KEY);
			let s = data.cart?.payment_session?.data?.client_secret ?? '';
			if (typeof s === 'string' && s) client_secret = s;
			console.log(`client_secret: ${client_secret}`);
			elements_options.clientSecret = client_secret;

			const shipping_option_res = await fetch('/api/checkout/get-shipping-options');
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

	const paymentOptions: StripePaymentElementOptions = {
		business: {
			name: 'Rockabilly Roasting'
		}
	};

	// Shipping address logic
	let show_shipping_address_book = true;
	let show_shipping_address_form = false;
	let is_shipping_option_selected = false;

	function handle_address_form_success() {
		// const { cart: c } = e.detail;
		// cart = c;
		show_shipping_address_book = false;
		show_shipping_address_form = false;
	}

	function handle_shipping_option_success(
		e: CustomEvent<{ cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> }>
	) {
		const { cart: c } = e.detail;
		if (c) cart = c;
		is_shipping_option_selected = true;
	}

	onMount(async () => {
		if (!data.is_trusted) {
			init = init_stripe_checkout();
		}

		// If shipping address exists close the tab
		if (data.cart?.shipping_address_id) show_shipping_address_book = false;
	});
</script>

{#if !data.cart?.items}
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
			{#if data.is_trusted && data.user}
				<TrustedCheckout bind:data {processing} on:success={handle_shipping_option_success} />
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

							<ShippingSelect
								data={shipping_options}
								{shipping_method_id}
								on:success={() => (is_shipping_option_selected = true)}
							/>
							{#if !is_shipping_option_selected}
								<p class="ml-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
									Please select a shipping method.
								</p>
							{/if}
						</div>

						<Button disabled={processing} type="submit" variant="default">Pay</Button>
					</form>
				{/await}
			{/if}
		</div>
	</div>
{/if}
