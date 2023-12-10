import type { PageServerLoad, Actions } from './$types';
import type { Cart, ShippingOption } from '$lib/types/cart';
import { fail, redirect, error } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateShippingAddressSchema, updateBillingAddressSchema } from '$lib/validators/checkout';

export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shippingAddressForm = await superValidate(updateShippingAddressSchema);

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
	// if (locals.user?.shipping_addresses && locals.user.shipping_addresses.length > 0) {
	// 	console.log('Checking for valid shipping address');
	// 	const isValid = updateShippingAddressSchema.safeParse(locals.user.shipping_addresses[0]);
	// 	if (isValid.success) {
	// 		console.log('Setting shipping address as default');
	// 		const { first_name, last_name, company, address_1, address_2, city, province, postal_code } =
	// 			isValid.data;
	// 		const defaultAddress = {
	// 			first_name,
	// 			last_name,
	// 			company,
	// 			address_1,
	// 			address_2,
	// 			city,
	// 			province,
	// 			postal_code,
	// 			country_code: 'us'
	// 		};
	// 		console.log(defaultAddress);
	// 		cart = (await medusa.updateCartShippingAddress(locals, defaultAddress)) as Cart;
	// 	}
	// }

	// Get shipping options
	// console.log('Fetching shipping options');
	// let shippingOptions = (await medusa.getShippingOptions(locals)) as ShippingOption[];
	// console.log(shippingOptions);
	// if (!shippingOptions) {
	// 	throw error(400, { message: 'Could not get shipping options' });
	// }

	return {
		user: locals.user,
		cart: locals.cart,
		shippingAddressForm
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		const order = await medusa.completeCart(locals);

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
			locals.cartid = '';
			locals.cart = null;
			return { success: true, order: order };
		} else {
			return fail(400, { success: false });
		}
	},
	updateShippingAddress: async ({ request, locals, fetch }) => {
		console.log(' Update shipping address');
		const shippingAddressForm = await superValidate(request, updateShippingAddressSchema);
		if (!shippingAddressForm.valid)
			return message(shippingAddressForm, 'This address is invalid.', { status: 400 }); // this shouldn't happen because of client-side validation
		const address = shippingAddressForm.data;
		if (!locals.cartid || !address) {
			return message(shippingAddressForm, 'Bad request', { status: 400 });
		}
		console.log('Calling medusa');
		let cart = await medusa.updateCartShippingAddress(locals, address);

		if (cart) {
			console.log('Update billing address');
			cart = await medusa.updateCartBillingAddress(locals, address);
			if (cart) {
				console.log('Success');
				return { cart, shippingAddressForm };
			}
			return fail(500, { cart, shippingAddressForm });
		}

		return fail(500, { cart, shippingAddressForm });
	},
	updateBillingAddress: async ({ request, locals, fetch }) => {
		console.log(' Update billing address');
		const billingAddressForm = await superValidate(request, updateBillingAddressSchema);
		if (!billingAddressForm.valid)
			return message(billingAddressForm, 'This address is invalid.', { status: 400 }); // this shouldn't happen because of client-side validation
		const address = billingAddressForm.data;
		if (!locals.cartid || !address) {
			return message(billingAddressForm, 'Bad request', { status: 400 });
		}
		console.log('Calling medusa');
		const cart = await medusa.updateCartBillingAddress(locals, address);

		if (cart) {
			console.log('Cart received');
			locals.cart = cart;
			return { cart, billingAddressForm };
		}

		return fail(500, { cart, billingAddressForm });
	}
};
