import { json } from '@sveltejs/kit';
import medusa from '$lib/medusa.js';
import type { AddToCartParams } from '$lib/medusaClient/types.js';

export async function POST({ request, locals, cookies }) {
	const data = await request.json();
	const variant_id = data?.variant_id ?? '';
	const quantity = parseInt(data?.quantity) ?? 1;
	if (!variant_id) return json({ success: false });

	const params: AddToCartParams = {
		variant_id,
		quantity
	};
	const res = await medusa.carts.addToCart(locals, cookies, params);
	if (res === null) return json({ success: false });
	const { cart } = res;
	locals.cart = cart;
	locals.cartId = cart.id;
	return json({
		success: true
	});
}
