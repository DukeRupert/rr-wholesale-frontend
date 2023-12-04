import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';

export const GET: RequestHandler = async ({ request, locals }) => {
	console.log('Fetching cart from locals to createPaymentSession');
	let cart = await medusa.createPaymentSessions(locals);
	console.log(cart);
	if (!cart.total) {
		throw error(400, { message: 'Could not create payment sessions' });
	}

	cart = await medusa.selectPaymentSession(locals, 'manual');
	if (!cart.total) {
		throw error(400, { message: 'Could not select payment provider' });
	}

	let shippingOptions = await medusa.getShippingOptions(locals);
	if (!shippingOptions) {
		throw error(400, { message: 'Could not get shipping options' });
	}

	return json({ cart, shippingOptions });
};
