import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateShippingAddressReq } from '$lib/validators/checkout';
import { addShippingAddressSchema } from '$lib/validators/account';
import { POST } from './shipping-address/+server';

export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shippingAddressForm = await superValidate(
		locals.user.shipping_addresses[0],
		addShippingAddressSchema
	);

	return {
		user: locals.user,
		cart: locals.cart,
		shippingAddressForm
	};
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
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
		const form = await superValidate(request, updateShippingAddressReq);
		if (!form.valid) return message(form, 'This address is invalid.', { status: 400 }); // this shouldn't happen because of client-side validation
		const address = form.data;
		if (!locals.cartid || !address) {
			return message(form, 'Bad request', { status: 400 });
		}
		const response = await fetch('/api/checkout/shipping-address', {
			method: 'POST',
			body: JSON.stringify({ address, locals })
		});
		const cart = await response.json();
		if (cart) return { success: true, cart: cart };
		else return fail(500, { success: false });
	}
};
