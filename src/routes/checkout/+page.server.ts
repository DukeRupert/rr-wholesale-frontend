import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateShippingAddressSchema } from '$lib/validators/checkout';
import { addShippingAddressSchema } from '$lib/validators/account';

export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	const shippingAddressForm = await superValidate(updateShippingAddressSchema);

	return {
		user: locals.user,
		cart: locals.cart,
		shippingAddressForm
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
		console.log(' Update shipping address')
		const shippingAddressForm = await superValidate(request, updateShippingAddressSchema);
		if (!shippingAddressForm.valid) return message(shippingAddressForm, 'This address is invalid.', { status: 400 }); // this shouldn't happen because of client-side validation
		const address = shippingAddressForm.data;
		if (!locals.cartid || !address) {
			return message(shippingAddressForm, 'Bad request', { status: 400 });
		}
		console.log('Calling medusa')
		const cart = await medusa.updateCartShippingAddress(locals, address);

		// try {
		// 	console.log('Add address to user list of shipping_addresses')
		// 	const success = (await medusa.addShippingAddress(locals, address)) as boolean;
		// 	console.log(success)
		// } catch (error) {
		// 	console.log(error)
		// }

		if (cart) {
			console.log('Cart received')
			locals.cart = cart;
			return { cart, shippingAddressForm }
		}
			
		return fail(500, { cart, shippingAddressForm })
		
	}
};
