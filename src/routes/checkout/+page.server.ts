import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addressSchema } from './(components)/trusted/shipping-address-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ locals, url }) {
	let { cart, user } = locals;
	const form = await superValidate(zod(addressSchema));

	// Add note to cart if it doesn't exist
	if (cart && cart.metadata) {
		console.log(cart.metadata)
	}

	// Payment session selection
	const createPaymentSessionsResponse = await medusa.carts.createPaymentSessions(locals);
	if (createPaymentSessionsResponse === null)
		throw error(400, { message: 'Could not create payment sessions' });
	cart = createPaymentSessionsResponse.cart;
	// Determine if customer is trusted
	const is_trusted = user?.metadata?.is_trusted ?? false;
	const provider_id = is_trusted ? 'manual' : 'stripe';
	// Set payment session, is_trusted ? manual : stripe
	const setPaymentSessionResponse = await medusa.carts.setPaymentSession(locals, provider_id);
	if (setPaymentSessionResponse === null)
		throw error(400, { message: 'Could not select payment provider' });
	cart = setPaymentSessionResponse.cart;

	return {
		user,
		is_trusted,
		cart,
		form
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		const res = await medusa.carts.complete(locals);
		if (res === null) throw error(400, { message: 'Could not complete cart' });
		if (res.type === 'order') medusa.carts.invalidateCart(locals, cookies);
		return { success: true };
	},
	updateShippingAddress: async ({ request, locals }) => {
		const form = await superValidate(request, zod(addressSchema));
		let cart = locals.cart;
		// Handle invalid data
		if (!form.valid) return message(form, { type: 'error', text: 'This address is invalid.' });

		// Update cart
		const { data: address } = form;
		const updateShippingResponse = await medusa.carts.update(locals, {
			shipping_address: address
		});
		if (updateShippingResponse === null) {
			return message(form, { type: 'error', text: 'Bad request' });
		}
		cart = updateShippingResponse.cart;

		// Update billing address
		const updateBillingAddressResponse = await medusa.carts.update(locals, {
			billing_address: address
		});
		if (updateBillingAddressResponse === null) {
			return message(form, { type: 'error', text: 'Bad request' });
		}
		cart = updateBillingAddressResponse.cart;

		locals.cart = cart;
		return { cart, shippingAddressForm: form };
	}
};
