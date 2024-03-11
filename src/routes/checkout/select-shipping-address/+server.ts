import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const POST: RequestHandler = async ({ request, locals }) => {
	const address = await request.json();
	if (!locals.cartId || !address) {
		throw error(400, 'bad format');
	}
	const res = await medusa.carts.update(locals, address);
	if (res === null) throw error(500, 'Server error');
	const { cart } = res;
	locals.cart = cart;
	return json({ success: true, cart });
};
