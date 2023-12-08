import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateShippingAddressSchema, updateBillingAddressSchema } from '$lib/validators/checkout';

export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shippingAddressForm = await superValidate(updateShippingAddressSchema);
	const billingAddressForm = await superValidate(updateBillingAddressSchema);

	return {
		user: locals.user,
		cart: locals.cart,
		shippingAddressForm,
		billingAddressForm
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		//remove cookie first because customer has already paid for the cart
		const order = await medusa.completeCart(locals);
		cookies.set('cartid', '', {
			path: '/',
			maxAge: 0,
			sameSite: 'strict',
			httpOnly: true,
			secure: true
		});
		locals.cartid = '';
		if (order) {
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
		const cart = await medusa.updateCartShippingAddress(locals, address);

		if (cart) {
			console.log('Cart received');
			locals.cart = cart;
			return { cart, shippingAddressForm };
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
