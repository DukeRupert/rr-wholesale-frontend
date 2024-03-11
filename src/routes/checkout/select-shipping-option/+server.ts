import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();
	let shipping_option_id = data.option_id as string;
	if (!locals.cartId || !shipping_option_id) {
		throw error(401, 'Bad format');
	}
	const res = await medusa.carts.addShippingMethod(locals, shipping_option_id);
	if (res === null) throw error(500, 'Server error');
	const { cart } = res;
	locals.cart = cart;
	return json({ success: true, cart });
};
