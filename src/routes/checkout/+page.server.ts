import type { PageServerLoad, Actions } from './$types';
import type { Cart, ShippingOption } from '$lib/types/cart';
import { fail, redirect, error } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { shippingAddressSchema } from '$lib/validators/account';

export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shippingAddressForm = await superValidate(shippingAddressSchema);

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
	console.log('Checking for valid shipping address');
	if (locals.user?.shipping_addresses && locals.user.shipping_addresses.length > 0) {
		console.log('Found saved address. Setting index 0 as cart shipping address');
		const saved_address = locals.user.shipping_addresses[0]
		console.log(saved_address)
		const isValid = shippingAddressSchema.safeParse(saved_address);
		if(!isValid.success) console.log(isValid.error)
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
			cart = (await medusa.updateCartShippingAddress(locals, defaultAddress)) as Cart;
		}
	}

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
			return { order: order };
		} else {
			return fail(400, { success: false });
		}
	},
	updateShippingAddress: async ({ request, locals, fetch }) => {
		console.log('Update shipping address');
		const shippingAddressForm = await superValidate(request, shippingAddressSchema);
		// Handle invalid data
		if (!shippingAddressForm.valid)
			return message(shippingAddressForm, 'This address is invalid.', { status: 400 }); // this shouldn't happen because of client-side validation

		// If there is no cart in locals, throw an error
		const { data: address } = shippingAddressForm;
		if (!locals.cartid || !address) {
			return message(shippingAddressForm, 'Bad request', { status: 400 });
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
