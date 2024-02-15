import type { RequestHandler } from './$types';
import medusaClient from '$lib/medusaClient';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();
	let shipping_option_id = data.option_id as string;
	if (!locals.cartId || !shipping_option_id) {
		throw error(401, 'Bad format');
	}
	const res = await medusaClient.addShippingMethod(locals, shipping_option_id);
	if (res === null) throw error(500, 'Server error');
	const { cart } = res;
	return json(cart);
};
