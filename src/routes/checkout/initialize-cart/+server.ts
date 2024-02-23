import type { RequestHandler } from './$types';
import { fail, redirect, error, json } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { shippingAddressSchema } from '$lib/validators/account';
import medusa from '$lib/medusa';
import { addToast } from '$lib/components/toast/index.svelte';

export const GET: RequestHandler = async ({ locals }) => {
	console.log('Initialize cart');
	let { cart, user } = locals;

	// Payment session selection
	console.log('Create payment sessions');
	const createPaymentSessionsResponse = await medusa.carts.createPaymentSessions(locals);
	if (createPaymentSessionsResponse === null)
		throw error(400, { message: 'Could not create payment sessions' });
	cart = createPaymentSessionsResponse.cart;

	console.log('Determine if customer is trusted');
	const is_trusted = user?.metadata?.is_trusted ?? false;
	const provider_id = is_trusted ? 'manual' : 'stripe';

	console.log('Set payment session');
	const setPaymentSessionResponse = await medusa.carts.setPaymentSession(locals, provider_id);
	if (setPaymentSessionResponse === null)
		throw error(400, { message: 'Could not select payment provider' });
	cart = setPaymentSessionResponse.cart;

	// Get shipping options
	console.log('Fetch shipping options');
	const listShippingOptionsResponse = await medusa.shippingOptions.listCartOptions(locals);
	if (listShippingOptionsResponse === null)
		throw error(400, { message: 'Could not fetch shipping options' });
	const { shipping_options } = listShippingOptionsResponse;

	return json({
        user,
		cart,
		shipping_options
	});
};
