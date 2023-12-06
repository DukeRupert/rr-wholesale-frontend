import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import type { Cart } from '$lib/types/cart';

export const GET: RequestHandler = async ({ request, locals }) => {
	console.log('Fetching cart from locals to createPaymentSession');
	let cart = await medusa.createPaymentSessions(locals) as Cart;
	
	if (!cart.total) {
		throw error(400, { message: 'Could not create payment sessions' });
	}

	cart = await medusa.selectPaymentSession(locals, 'manual') as Cart;
	if (!cart.total) {
		throw error(400, { message: 'Could not select payment provider' });
	}

	// If user has an associated shipping address then update the cart with it
	if(locals.user?.shipping_addresses && locals.user.shipping_addresses.length > 0) {
		console.log('Setting default shipping address');
		const defaultAddress = locals.user.shipping_addresses[0]
		cart = await medusa.updateCartShippingAddress(locals, defaultAddress) as Cart;
	}

	// If cart has default shipping address, then make it the default billing address
	if(locals.cart?.shipping_address_id) {
		console.log('Setting default billing address');
		cart = await medusa.updateCartBillingAddress(locals, locals.cart.shipping_address_id) as Cart;
	}

	// Get shipping options
	let shippingOptions = await medusa.getShippingOptions(locals) as Cart;
	if (!shippingOptions) {
		throw error(400, { message: 'Could not get shipping options' });
	}

	// If there is only one shipping option then select it
	if(cart?.shipping_methods && cart.shipping_methods.length === 1) {
		console.log('Setting default shipping method');
		const defaultShippingOption = cart.shipping_methods[0]
		cart = await medusa.selectShippingOption(locals, defaultShippingOption.id)
	}

	return json({ cart, shippingOptions });
};
