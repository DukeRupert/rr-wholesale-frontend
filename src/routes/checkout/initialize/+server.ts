import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import type { Cart, ShippingOption } from '$lib/types/cart';
import { shippingAddressSchema } from '$lib/validators/account';
import { z } from 'zod';

export const GET: RequestHandler = async ({ request, locals }) => {
	console.log('Fetching cart from locals to createPaymentSession');
	let cart = (await medusa.createPaymentSessions(locals)) as Cart;

	if (!cart.total) {
		throw error(400, { message: 'Could not create payment sessions' });
	}

	cart = (await medusa.selectPaymentSession(locals, 'manual')) as Cart;
	if (!cart.total) {
		throw error(400, { message: 'Could not select payment provider' });
	}

	// If user has an associated shipping address then update the cart with it
	if (locals.user?.shipping_addresses && locals.user.shipping_addresses.length > 0) {
		console.log('Checking for valid shipping address');
		const isValid = shippingAddressSchema.safeParse(locals.user.shipping_addresses[0]);
		if (isValid.success) {
			console.log('Setting shipping address as default');
			const { first_name, last_name, company, address_1, address_2, city, province, postal_code } =
				isValid.data;
			const defaultAddress = {
				first_name,
				last_name,
				company,
				address_1,
				address_2,
				city,
				province,
				postal_code,
				country_code: 'us'
			};
			console.log(defaultAddress);
			cart = (await medusa.updateCartShippingAddress(locals, defaultAddress)) as Cart;
		}
	}

	// Get shipping options
	let shippingOptions = (await medusa.getShippingOptions(locals)) as ShippingOption[];
	if (!shippingOptions) {
		throw error(400, { message: 'Could not get shipping options' });
	}

	// If there is only one shipping option then select it
	if (shippingOptions && shippingOptions.length === 1) {
		console.log('Setting default shipping method');
		const defaultShippingOption = shippingOptions[0].id;
		console.log(defaultShippingOption);
		cart = await medusa.selectShippingOption(locals, defaultShippingOption);
	}

	return json({ cart, shippingOptions });
};
