import type { PageServerLoad, Actions } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import medusaClient from '$lib/medusaClient';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { shippingAddressSchema } from '$lib/validators/account';

export const load: PageServerLoad = async function ({ locals, url }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shipping_address_form = await superValidate<Infer<typeof shippingAddressSchema>>(
		zod(shippingAddressSchema)
	);

	let { cart, user } = locals;
	console.log('Create payment sessions');
	const createPaymentSessionsResponse = await medusaClient.createPaymentSessions(locals);
	if (createPaymentSessionsResponse === null)
		throw error(400, { message: 'Could not create payment sessions' });
	cart = createPaymentSessionsResponse.cart;

	console.log('Set payment session');
	const { is_trusted } = locals?.user?.metadata ?? false;
	const provider_id = is_trusted ? 'manual' : 'stripe';
	const setPaymentSessionResponse = await medusaClient.setPaymentSession(locals, provider_id);
	if (setPaymentSessionResponse === null)
		throw error(400, { message: 'Could not select payment provider' });
	cart = setPaymentSessionResponse.cart;

	// Get shipping options
	console.log('Fetch shipping options');
	const listShippingOptionsResponse = await medusaClient.listShippingOptions(locals);
	if (listShippingOptionsResponse === null)
		throw error(400, { message: 'Could not fetch shipping options' });
	const { shipping_options } = listShippingOptionsResponse;

	return {
		user,
		cart,
		shipping_options,
		shipping_address_form
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		const res = await medusaClient.completeCart(locals)
		if(res === null)
		throw error(400, { message: 'Could not complete cart' });

		if (res.type === "order") {
			medusaClient.invalidateCart(locals, cookies)
			return { order: res.data };
		} else {
			return fail(400, { success: false });
		}
	},
	updateShippingAddress: async ({ request, locals }) => {
		const shippingAddressForm = await superValidate(request, zod(shippingAddressSchema));
		let cart = locals.cart;
		// Handle invalid data
		if (!shippingAddressForm.valid)
			return message(shippingAddressForm, { type: 'error', text: 'This address is invalid.' });

		// Update cart
		console.log('Update shipping address');
		const { data: address } = shippingAddressForm;
		const updateShippingResponse = await medusaClient.updateCart(locals, {
			shipping_address: address
		});
		if (updateShippingResponse === null) {
			return message(shippingAddressForm, { type: 'error', text: 'Bad request' });
		}
		cart = updateShippingResponse.cart;

		// Update billing address
		console.log('Update billing address');
		const updateBillingAddressResponse = await medusaClient.updateCart(locals, {
			billing_address: address
		});
		if (updateBillingAddressResponse === null) {
			return message(shippingAddressForm, { type: 'error', text: 'Bad request' });
		}
		cart = updateBillingAddressResponse.cart;

		return { cart, shippingAddressForm };
	}
};
