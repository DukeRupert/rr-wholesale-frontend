import type { RequestHandler } from './$types';
import medusa from '$lib/server/medusa';
import { error, json } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateShippingAddressReq } from '$lib/validators/checkout';

export const POST: RequestHandler = async ({ request, locals }) => {
	const form = await superValidate(request, updateShippingAddressReq);
	if (!form.valid) throw error(400, 'This address is invalid.'); // this shouldn't happen because of client-side validation
	const address = form.data;
	if (!locals.cartid || !address) {
		throw error(400, 'Bad format');
	}
	const cart = await medusa.updateCartShippingAddress(locals, address);
	if (cart) return json(cart);
	else throw error(500, 'server error');
};
