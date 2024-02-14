import type { PageServerLoad, Actions } from './$types';
import type { Cart, ShippingOption } from '$lib/types/cart';
import type { OrderSummary } from '$lib/types/order';
import { fail, redirect, error } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import medusaClient from '$lib/medusaClient';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { shippingAddressSchema } from '$lib/validators/account';

export const load: PageServerLoad = async function ({ locals, url }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shipping_address_form = await superValidate<Infer<typeof shippingAddressSchema>>(zod(shippingAddressSchema));

	console.log('Fetching cart from locals to createPaymentSession');
	const createPaymentSessionsResponse = await medusaClient.createPaymentSessions(locals);
	if(createPaymentSessionsResponse === null) throw error(400, { message: 'Could not create payment sessions' });
	let cart = createPaymentSessionsResponse.cart;

	const setPaymentSessionResponse = await medusaClient.setPaymentSession(locals, 'manual');
	if(setPaymentSessionResponse === null) throw error(400, { message: 'Could not select payment provider' });
	cart = setPaymentSessionResponse.cart;

	// Get shipping options
	console.log('Fetching shipping options');
	let shippingOptions = (await medusa.getShippingOptions(locals)) as ShippingOption[];
	console.log(shippingOptions);
	if (!shippingOptions) {
		throw error(400, { message: 'Could not get shipping options' });
	}

	return {
		user: locals.user,
		cart: locals.cart,
		shippingOptions,
		shipping_address_form
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		const order = await medusa.completeCart(locals) as OrderSummary;

		if (order) {
			//remove cookie first because customer has already paid for the cart
			cookies.set('cartid', '', {
				path: '/',
				maxAge: 0,
				sameSite: 'strict',
				httpOnly: true,
				secure: true
			});
			// reset locals
			locals.cartId = '';
			locals.cart = null;
			return { order: order };
		} else {
			return fail(400, { success: false });
		}
	},
	updateShippingAddress: async ({ request, locals, fetch }) => {
		console.log('Update shipping address');
		const shippingAddressForm = await superValidate(request, zod(shippingAddressSchema));
		// Handle invalid data
		if (!shippingAddressForm.valid)
			return message(shippingAddressForm, { type: 'error', text: 'This address is invalid.' });

		// If there is no cart in locals, throw an error
		const { data: address } = shippingAddressForm;
		if (!locals.cartId || !address) {
			return message(shippingAddressForm, { type: 'error', text: 'Bad request' });
		}

		// Update cart
		let cart = await medusa.updateCartShippingAddress(locals, address);
		if (!cart.total) {
			throw error(400, { message: 'Could not update shipping address' });
		}

		// Update billing address
		console.log('Update billing address');
		cart = await medusa.updateCartBillingAddress(locals, address);
		if (!cart.total) {
			throw error(400, { message: 'Could not update billing address' });
		}

		return { cart, shippingAddressForm };
	}
};
